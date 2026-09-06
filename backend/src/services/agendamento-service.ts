import crypto from 'crypto';
import { criarRepoAgendamento, CriarAgendamentoInput, AppointmentRow, AppointmentStatus } from '../repositories/agendamento-repository';
import { criarRepoCliente } from '../repositories/cliente-repository';
import { criarRepoUsuario } from '../repositories/usuario-repository';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validarDadosAgendamento(input: {
  professionalId: string;
  dateIso: string;
  time: string;
}): void {
  if (!input.professionalId) {
    throw new ValidationError('Profissional é obrigatório');
  }
  if (!DATE_RE.test(input.dateIso)) {
    throw new ValidationError('Data inválida');
  }
  if (!TIME_RE.test(input.time)) {
    throw new ValidationError('Horário inválido');
  }
}

async function obterOuCriarCliente(dados: {
  nome: string;
  email: string;
  telefone?: string;
}): Promise<string> {
  const clienteRepo = await criarRepoCliente();
  const usuarioRepo = await criarRepoUsuario();
  const email = dados.email.trim().toLowerCase();

  const clienteExistente = await clienteRepo.buscarPorEmail(email);
  if (clienteExistente) {
    return String(clienteExistente.id ?? '');
  }

  const usuarioId = await usuarioRepo.criarClientePadrao({
    nome: dados.nome,
    email,
    telefone: dados.telefone,
  });

  const clienteId = crypto.randomUUID();
  const now = new Date().toISOString();
  await clienteRepo.criar({
    id: clienteId,
    usuario_id: usuarioId,
    nome: dados.nome.trim(),
    telefone: dados.telefone ?? null,
    created_at: now,
    updated_at: now,
  });

  return clienteId;
}

export async function criarAgendamento(dados: {
  clientName: string;
  phone: string;
  email: string;
  serviceIds: string[];
  professionalId: string;
  dateIso: string;
  time: string;
}): Promise<AppointmentRow> {
  validarDadosAgendamento(dados);

  if (!dados.clientName?.trim() || !dados.email?.trim()) {
    throw new ValidationError('Nome e e-mail do cliente são obrigatórios');
  }

  const repo = await criarRepoAgendamento();

  const existing = await repo.listar();
  const conflito = existing.find(
    (a) =>
      a.professionalId === dados.professionalId &&
      a.dateIso === dados.dateIso &&
      a.time === dados.time &&
      a.status !== 'cancelado',
  );
  if (conflito) {
    throw new ValidationError('Horário já ocupado para este profissional');
  }

  const clienteId = await obterOuCriarCliente({
    nome: dados.clientName,
    email: dados.email,
    telefone: dados.phone,
  });

  const input: CriarAgendamentoInput = {
    clienteId,
    professionalId: dados.professionalId,
    serviceIds: dados.serviceIds,
    data: dados.dateIso,
    hora: dados.time,
    status: 'pendente',
  };

  return repo.criar(input);
}

export async function listarAgendamentos(
  filtros: { email?: string; data?: string; profissionalId?: string } = {},
): Promise<AppointmentRow[]> {
  const repo = await criarRepoAgendamento();
  if (filtros.email) return repo.listarPorEmail(filtros.email);
  if (filtros.profissionalId) return repo.listarPorProfissional(filtros.profissionalId);
  if (filtros.data) return repo.listarPorData(filtros.data);
  return repo.listar();
}

export async function buscarAgendamentoPorCode(code: string): Promise<AppointmentRow> {
  const repo = await criarRepoAgendamento();
  const found = await repo.buscarPorCode(code);
  if (!found) throw new NotFoundError('Agendamento não encontrado');
  return found;
}

export async function cancelarAgendamento(code: string): Promise<AppointmentRow> {
  const repo = await criarRepoAgendamento();
  const updated = await repo.cancelar(code);
  if (!updated) throw new NotFoundError('Agendamento não encontrado');
  return updated;
}

export async function atualizarStatusAgendamento(
  code: string,
  status: AppointmentStatus,
): Promise<AppointmentRow> {
  if (!['confirmado', 'pendente', 'concluido', 'cancelado'].includes(status)) {
    throw new ValidationError('Status inválido');
  }
  const repo = await criarRepoAgendamento();
  const updated = await repo.atualizarStatus(code, status);
  if (!updated) throw new NotFoundError('Agendamento não encontrado');
  return updated;
}

export async function reagendarAgendamento(
  code: string,
  changes: { professionalId: string; dateIso: string; time: string },
): Promise<AppointmentRow> {
  validarDadosAgendamento(changes);
  const repo = await criarRepoAgendamento();
  const updated = await repo.reagendar(code, changes);
  if (!updated) throw new NotFoundError('Agendamento não encontrado');
  return updated;
}
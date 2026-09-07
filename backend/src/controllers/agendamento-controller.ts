import { Request, Response } from 'express';
import {
  criarAgendamento,
  listarAgendamentos,
  buscarAgendamentoPorCode,
  cancelarAgendamento,
  atualizarStatusAgendamento,
  reagendarAgendamento,
} from '../services/agendamento-service';
import type { AppointmentRow } from '../repositories/agendamento-repository';
import type { JwtPayload } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth';
import { ForbiddenError } from '../errors/ForbiddenError';
import { criarRepoProfissional } from '../repositories/profissional-repository';

interface AgendamentoScope {
  permiteLeituraGeral: boolean;
  email?: string;
  profissionalId?: string;
  podeAlterarStatus: boolean;
}

async function buildScope(user: JwtPayload): Promise<AgendamentoScope> {
  if (user.role === 'cliente') {
    return { permiteLeituraGeral: false, email: user.email, podeAlterarStatus: false };
  }
  if (user.role === 'profissional') {
    const repo = await criarRepoProfissional();
    const perfil = await repo.buscarPorUsuarioId(user.sub);
    if (!perfil) {
      throw new ForbiddenError('Perfil profissional não vinculado ao usuário');
    }
    return { permiteLeituraGeral: false, profissionalId: perfil.id, podeAlterarStatus: true };
  }
  return { permiteLeituraGeral: true, podeAlterarStatus: true };
}

function exigirProprietario(scope: AgendamentoScope, agendamento: AppointmentRow): void {
  if (scope.permiteLeituraGeral) return;
  if (scope.email) {
    if (agendamento.email.toLowerCase() !== scope.email.toLowerCase()) {
      throw new ForbiddenError('Sem permissão para este agendamento');
    }
    return;
  }
  if (scope.profissionalId) {
    if (agendamento.professionalId !== scope.profissionalId) {
      throw new ForbiddenError('Sem permissão para este agendamento');
    }
    return;
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    const agendamento = await criarAgendamento({
      clientName: String(req.body?.clientName ?? ''),
      phone: String(req.body?.phone ?? ''),
      email: String(req.body?.email ?? ''),
      serviceIds: Array.isArray(req.body?.serviceIds) ? req.body.serviceIds.map((s: unknown) => String(s)) : [],
      professionalId: String(req.body?.professionalId ?? ''),
      dateIso: String(req.body?.dateIso ?? ''),
      time: String(req.body?.time ?? ''),
    });
    res.status(201).json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao criar agendamento';
    res.status(status).json({ message });
  }
}

export async function listar(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }
    const scope = await buildScope(user);
    const email = typeof req.query?.email === 'string' ? req.query.email : undefined;
    const data = typeof req.query?.data === 'string' ? req.query.data : undefined;
    const profissionalId =
      typeof req.query?.profissionalId === 'string' ? req.query.profissionalId : undefined;

    let lista: AppointmentRow[];
    if (scope.permiteLeituraGeral) {
      lista = await listarAgendamentos({ email, data, profissionalId });
    } else if (scope.email) {
      if (email && email.toLowerCase() !== scope.email.toLowerCase()) {
        throw new ForbiddenError('Só é possível consultar seus próprios agendamentos');
      }
      lista = await listarAgendamentos({ email: scope.email, data });
    } else if (scope.profissionalId) {
      if (profissionalId && profissionalId !== scope.profissionalId) {
        throw new ForbiddenError('Só é possível consultar sua própria agenda');
      }
      lista = await listarAgendamentos({ profissionalId: scope.profissionalId, data });
    } else {
      lista = [];
    }
    res.json(lista);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : 'Erro ao listar agendamentos';
    res.status(status).json({ message });
  }
}

export async function buscarPorCode(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }
    const scope = await buildScope(user);
    const agendamento = await buscarAgendamentoPorCode(String(req.params?.code ?? ''));
    exigirProprietario(scope, agendamento);
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 404;
    const message = error instanceof Error ? error.message : 'Agendamento não encontrado';
    res.status(status).json({ message });
  }
}

export async function cancelar(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }
    const scope = await buildScope(user);
    const code = String(req.params?.code ?? '');
    const existente = await buscarAgendamentoPorCode(code);
    exigirProprietario(scope, existente);
    const agendamento = await cancelarAgendamento(code);
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 404;
    const message = error instanceof Error ? error.message : 'Erro ao cancelar agendamento';
    res.status(status).json({ message });
  }
}

export async function atualizarStatus(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }
    const scope = await buildScope(user);
    if (!scope.podeAlterarStatus) {
      throw new ForbiddenError('Cliente não pode alterar o status do agendamento');
    }
    const code = String(req.params?.code ?? '');
    const existente = await buscarAgendamentoPorCode(code);
    exigirProprietario(scope, existente);
    const agendamento = await atualizarStatusAgendamento(
      code,
      String(req.body?.status ?? '') as 'confirmado' | 'pendente' | 'concluido' | 'cancelado',
    );
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao atualizar status';
    res.status(status).json({ message });
  }
}

export async function reagendar(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }
    const scope = await buildScope(user);
    const code = String(req.params?.code ?? '');
    const existente = await buscarAgendamentoPorCode(code);
    exigirProprietario(scope, existente);
    const agendamento = await reagendarAgendamento(code, {
      professionalId: String(req.body?.professionalId ?? ''),
      dateIso: String(req.body?.dateIso ?? ''),
      time: String(req.body?.time ?? ''),
    });
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao reagendar';
    res.status(status).json({ message });
  }
}
import { randomUUID } from 'crypto';
import getDb from '../database/connection';
import { SheetsRepository, InsertInput } from '../database/repository';
import type { SheetRow } from '../database/sheets-client';

const SHEET_AGENDAMENTO = 'agendamento';
const SHEET_CLIENTE = 'cliente';
const SHEET_USUARIO = 'usuario';

export type AppointmentStatus =
  | 'confirmado'
  | 'pendente'
  | 'concluido'
  | 'cancelado';

export interface AppointmentRow {
  id: string;
  code: string;
  clientName: string;
  phone: string;
  email: string;
  serviceIds: string[];
  professionalId: string;
  dateIso: string;
  time: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CriarAgendamentoInput {
  clienteId: string;
  professionalId: string;
  serviceIds: string[];
  data: string;
  hora: string;
  status?: AppointmentStatus;
  observacao?: string;
}

const CODE_LETTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_RE = /^[A-Z]{2}-[A-Z0-9]{5}$/;

function randomChar(source: string): string {
  const bytes = new Uint8Array(1);
  crypto.getRandomValues(bytes);
  return source.charAt(bytes[0]! % source.length);
}

function generateCode(existing: Set<string>): string {
  for (let attempt = 0; attempt < 60; attempt++) {
    let code = '';
    code += randomChar(CODE_LETTERS);
    code += randomChar(CODE_LETTERS);
    code += '-';
    for (let i = 0; i < 5; i++) {
      code += randomChar(CODE_CHARS);
    }
    if (!existing.has(code)) return code;
  }
  return `XX-${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

function normalizeStatus(raw: unknown): AppointmentStatus {
  const value = String(raw ?? 'pendente');
  if (value === 'confirmado' || value === 'concluido' || value === 'cancelado') {
    return value;
  }
  return 'pendente';
}

const EXCEL_EPOCH_OFFSET_DAYS = 25569; // dias entre 1899-12-30 e 1970-01-01
const MS_PER_DAY = 86400_000;

/** Converte serial do Google Sheets (dias desde 1899-12-30) para YYYY-MM-DD. */
function excelSerialToIso(serial: number): string {
  const ms = (serial - EXCEL_EPOCH_OFFSET_DAYS) * MS_PER_DAY;
  return new Date(ms).toISOString().slice(0, 10);
}

/** Converte fração de dia (serial de hora) para HH:mm. */
function excelFractionToTime(fraction: number): string {
  const totalMinutes = Math.round(fraction * 24 * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function normalizeDate(raw: unknown): string {
  const value = String(raw ?? '');
  if (typeof raw === 'number') {
    return excelSerialToIso(raw);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [d, m, y] = value.split('/').map(Number);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return value;
}

function normalizeTime(raw: unknown): string {
  if (typeof raw === 'number') return excelFractionToTime(raw);
  return String(raw ?? '');
}

export class AgendamentoRepository extends SheetsRepository {
  protected readonly sheetName = SHEET_AGENDAMENTO;

  async criar(dados: CriarAgendamentoInput): Promise<AppointmentRow> {
    const existing = new Set(
      (await this.findAll()).map((r) => String(r.code ?? '')),
    );
    const code = generateCode(existing);
    const id = randomUUID();
    const now = new Date().toISOString();

    const values: InsertInput = {
      id,
      code,
      cliente_id: dados.clienteId,
      funcionario_id: dados.professionalId,
      servico_id: dados.serviceIds[0] ?? null,
      data: dados.data,
      hora: dados.hora,
      status: dados.status ?? 'pendente',
      observacao: dados.observacao ?? null,
      created_at: now,
      updated_at: now,
    };
    await this.insert(values);

    return {
      id,
      code,
      clientName: '',
      phone: '',
      email: '',
      serviceIds: dados.serviceIds,
      professionalId: dados.professionalId,
      dateIso: dados.data,
      time: dados.hora,
      status: dados.status ?? 'pendente',
      createdAt: now,
    };
  }

  private async mapToAppointment(row: SheetRow): Promise<AppointmentRow | null> {
    const id = String(row.id ?? '');
    if (!id) return null;

    let clientName = String(row.clientName ?? '');
    let phone = String(row.phone ?? '');
    let email = String(row.email ?? '');
    const clienteId = String(row.cliente_id ?? '');

    if (clienteId) {
      const db = getDb();
      const clientes = await db.readSheet(SHEET_CLIENTE);
      const cliente = clientes.find((c) => c.record.id === clienteId);
      if (cliente) {
        clientName = String(cliente.record.nome ?? clientName);
        phone = String(cliente.record.telefone ?? phone);
        const usuarios = await db.readSheet(SHEET_USUARIO);
        const usuario = usuarios.find(
          (u) => u.record.id === String(cliente.record.usuario_id ?? ''),
        );
        email = String(usuario?.record.email ?? email);
      }
    }

    let professionalId = String(row.funcionario_id ?? '');
    if (!professionalId) {
      professionalId = String(row.professionalId ?? '');
    }

    const serviceId = String(row.servico_id ?? '');
    const serviceIds = serviceId ? [serviceId] : [];

    const rawCode = String(row.code ?? '');
    const code = rawCode || id;

    return {
      id,
      code,
      clientName,
      phone,
      email,
      serviceIds,
      professionalId,
      dateIso: normalizeDate(row.data),
      time: normalizeTime(row.hora),
      status: normalizeStatus(row.status),
      createdAt: String(row.created_at ?? new Date().toISOString()),
    };
  }

  async listar(): Promise<AppointmentRow[]> {
    const rows = await this.findAll();
    const result: AppointmentRow[] = [];
    for (const row of rows) {
      const mapped = await this.mapToAppointment(row);
      if (mapped) result.push(mapped);
    }
    return result;
  }

  async buscarPorCode(code: string): Promise<AppointmentRow | null> {
    const normalized = code.trim().toUpperCase();
    for (const row of await this.findAll()) {
      if (String(row.code ?? '').toUpperCase() === normalized) {
        return this.mapToAppointment(row);
      }
    }
    return null;
  }

  async listarPorEmail(email: string): Promise<AppointmentRow[]> {
    const normalized = email.trim().toLowerCase();
    const all = await this.listar();
    return all.filter((a) => a.email.toLowerCase() === normalized);
  }

  async listarPorProfissional(professionalId: string): Promise<AppointmentRow[]> {
    const all = await this.listar();
    return all.filter((a) => a.professionalId === professionalId);
  }

  async listarPorData(data: string): Promise<AppointmentRow[]> {
    const all = await this.listar();
    return all.filter((a) => a.dateIso === data);
  }

  async atualizarStatus(
    code: string,
    status: AppointmentStatus,
  ): Promise<AppointmentRow | null> {
    const normalized = code.trim().toUpperCase();
    const index = (await this.findAllIndexed()).find(
      (r) => String(r.record.code ?? '').toUpperCase() === normalized,
    );
    if (!index) return null;
    await this.updateByIndex(index.rowIndex, {
      status,
      updated_at: new Date().toISOString(),
    });
    return this.mapToAppointment({ ...index.record, status });
  }

  async cancelar(code: string): Promise<AppointmentRow | null> {
    return this.atualizarStatus(code, 'cancelado');
  }

  async reagendar(
    code: string,
    changes: { professionalId: string; dateIso: string; time: string },
  ): Promise<AppointmentRow | null> {
    const normalized = code.trim().toUpperCase();
    const index = (await this.findAllIndexed()).find(
      (r) => String(r.record.code ?? '').toUpperCase() === normalized,
    );
    if (!index) return null;
    await this.updateByIndex(index.rowIndex, {
      funcionario_id: changes.professionalId,
      data: changes.dateIso,
      hora: changes.time,
      status: 'pendente',
      updated_at: new Date().toISOString(),
    });
    return this.mapToAppointment({
      ...index.record,
      funcionario_id: changes.professionalId,
      data: changes.dateIso,
      hora: changes.time,
      status: 'pendente',
    });
  }

  async excluir(id: string): Promise<boolean> {
    return this.deleteOne((r) => String(r.id ?? '') === id);
  }
}

export async function criarRepoAgendamento(): Promise<AgendamentoRepository> {
  return new AgendamentoRepository(getDb());
}

export { CODE_RE };
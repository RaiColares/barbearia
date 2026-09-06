import getDb from '../database/connection';
import { SheetsRepository, InsertInput } from '../database/repository';
import type { SheetRow } from '../database/sheets-client';

export interface HorarioTrabalhoDTO {
  id: string;
  profissionalId: string;
  diaSemana: number | string;
  horaInicio: string;
  horaFim: string;
  ativo: boolean;
}

function toString(v: unknown): string {
  return v == null ? '' : String(v);
}

function toBoolean(v: unknown): boolean {
  return v === true || v === 'TRUE' || v === 'true' || v === 1 || v === '1';
}

function parseHora(v: unknown): string {
  if (typeof v === 'number' && Number.isFinite(v)) {
    const totalMinutes = Math.round(v * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const s = toString(v);
  if (/^\d{1,2}:\d{2}$/.test(s)) return s;
  const n = Number(s);
  if (Number.isFinite(n) && s !== '') return parseHora(n);
  return '';
}

function mapHorario(row: SheetRow): HorarioTrabalhoDTO {
  const dia = row.dia_semana;
  const diaSemana: number | string = typeof dia === 'number' || typeof dia === 'string' ? dia : 0;
  return {
    id: toString(row.id),
    profissionalId: toString(row.funcionario_id),
    diaSemana,
    horaInicio: parseHora(row.hora_inicio),
    horaFim: parseHora(row.hora_fim),
    ativo: toBoolean(row.ativo),
  };
}

export class HorarioTrabalhoRepository extends SheetsRepository {
  protected readonly sheetName = 'horario_trabalho';

  async listarPorProfissional(profissionalId: string): Promise<HorarioTrabalhoDTO[]> {
    const rows = await this.findAll();
    return rows
      .filter(r => String(r.funcionario_id ?? '') === profissionalId)
      .map(r => mapHorario(r));
  }

  async listarTodos(): Promise<HorarioTrabalhoDTO[]> {
    const rows = await this.findAll();
    return rows.map(r => mapHorario(r));
  }

  async criar(dados: Omit<HorarioTrabalhoDTO, 'id'>): Promise<HorarioTrabalhoDTO> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const values: InsertInput = {
      id,
      funcionario_id: dados.profissionalId,
      dia_semana: dados.diaSemana,
      hora_inicio: dados.horaInicio,
      hora_fim: dados.horaFim,
      ativo: dados.ativo !== false,
      created_at: now,
      updated_at: now,
    };
    await this.insert(values);
    return { ...dados, id };
  }

  async excluirPorProfissional(profissionalId: string): Promise<void> {
    const rows = await this.findAllIndexed();
    for (const row of rows) {
      if (String(row.record.funcionario_id ?? '') === profissionalId) {
        await this.deleteOne((r) => r.id === row.record.id).catch(() => undefined);
      }
    }
  }
}

export async function criarRepoHorarioTrabalho(): Promise<HorarioTrabalhoRepository> {
  return new HorarioTrabalhoRepository(getDb());
}

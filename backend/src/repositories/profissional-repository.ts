import getDb from '../database/connection';
import { SheetsRepository, InsertInput } from '../database/repository';
import type { SheetRow } from '../database/sheets-client';

export interface ProfissionalDTO {
  id: string;
  name: string;
  role: string;
  category: string;
  active: boolean;
  email?: string;
  photoUrl?: string;
}

function toString(v: unknown): string {
  return v == null ? '' : String(v);
}

function toBoolean(v: unknown): boolean {
  return v === true || v === 'TRUE' || v === 'true' || v === 1 || v === '1';
}

function mapProfissional(row: SheetRow): ProfissionalDTO {
  return {
    id: toString(row.id),
    name: toString(row.nome),
    role: toString(row.cargo) || 'professional',
    category: toString(row.especialidade),
    active: toBoolean(row.ativo),
    photoUrl: toString(row.foto) || undefined,
  };
}

export interface ProfissionalRepositoryInput extends Omit<ProfissionalDTO, 'id'> {
  id?: string;
}

export class ProfissionalRepository extends SheetsRepository {
  protected readonly sheetName = 'funcionario';

  async listar(): Promise<ProfissionalDTO[]> {
    const rows = await this.findAll();
    return rows.map(r => mapProfissional(r));
  }

  async buscarPorId(id: string): Promise<ProfissionalDTO | null> {
    const match = await this.findBy((r) => String(r.id ?? '') === id);
    return match ? mapProfissional(match.record) : null;
  }

  async criar(dados: Omit<ProfissionalDTO, 'id'>): Promise<ProfissionalDTO> {
    return this.criarComId(undefined, dados);
  }

  async criarComId(explicitId: string | undefined, dados: Omit<ProfissionalDTO, 'id'>): Promise<ProfissionalDTO> {
    const id = explicitId && explicitId.length > 0 ? explicitId : crypto.randomUUID();
    const now = new Date().toISOString();
    const values: InsertInput = {
      id,
      nome: dados.name,
      cargo: dados.role,
      especialidade: dados.category,
      foto: dados.photoUrl ?? '',
      ativo: dados.active !== false,
      created_at: now,
      updated_at: now,
    };
    await this.insert(values);
    return { ...dados, id };
  }

  async atualizar(id: string, dados: Partial<Omit<ProfissionalDTO, 'id'>>): Promise<ProfissionalDTO | null> {
    const updates: InsertInput = { updated_at: new Date().toISOString() };
    if (dados.name !== undefined) updates.nome = dados.name;
    if (dados.role !== undefined) updates.cargo = dados.role;
    if (dados.category !== undefined) updates.especialidade = dados.category;
    if (dados.photoUrl !== undefined) updates.foto = dados.photoUrl;
    if (dados.active !== undefined) updates.ativo = dados.active;
    const ok = await this.updateOne((r) => String(r.id ?? '') === id, updates);
    return ok ? this.buscarPorId(id) : null;
  }

  async excluir(id: string): Promise<boolean> {
    return this.deleteOne((r) => String(r.id ?? '') === id);
  }

  async vincularUsuario(funcionarioId: string, usuarioId: string): Promise<boolean> {
    return this.updateOne(
      (r) => String(r.id ?? '') === funcionarioId,
      { usuario_id: usuarioId, updated_at: new Date().toISOString() },
    );
  }

  async desvincularUsuario(funcionarioId: string): Promise<boolean> {
    return this.updateOne(
      (r) => String(r.id ?? '') === funcionarioId,
      { usuario_id: null, updated_at: new Date().toISOString() },
    );
  }

  async substituirTodos(itens: ProfissionalRepositoryInput[]): Promise<ProfissionalDTO[]> {
    const current = await this.findAllIndexed();
    for (const row of current) {
      await this.deleteOne((r) => r.id === row.record.id).catch(() => undefined);
    }
    const created: ProfissionalDTO[] = [];
    for (const item of itens) {
      created.push(await this.criarComId(item.id, item));
    }
    return created;
  }
}

export async function criarRepoProfissional(): Promise<ProfissionalRepository> {
  return new ProfissionalRepository(getDb());
}

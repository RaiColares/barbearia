import getDb from '../database/connection';
import { SheetsRepository, InsertInput } from '../database/repository';
import type { SheetRow } from '../database/sheets-client';

export interface ServicoDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMin: number;
  price: number;
  icon: 'scissors' | 'beard' | 'layers' | 'sparkle';
  active: boolean;
}

const VALID_ICONS: ServicoDTO['icon'][] = ['scissors', 'beard', 'layers', 'sparkle'];

function toString(v: unknown): string {
  return v == null ? '' : String(v);
}

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toBoolean(v: unknown): boolean {
  return v === true || v === 'TRUE' || v === 'true' || v === 1 || v === '1';
}

function mapServico(row: SheetRow): ServicoDTO {
  const icon = toString(row.icon);
  return {
    id: toString(row.id),
    name: toString(row.nome),
    description: toString(row.descricao),
    category: toString(row.categoria) || toString(row.especialidade) || '',
    durationMin: toNumber(row.duracao_minutos),
    price: toNumber(row.preco),
    icon: (VALID_ICONS.includes(icon as ServicoDTO['icon']) ? icon : 'scissors') as ServicoDTO['icon'],
    active: toBoolean(row.ativo),
  };
}

export interface ServicoRepositoryInput extends Omit<ServicoDTO, 'id'> {
  id?: string;
}

export class ServicoRepository extends SheetsRepository {
  protected readonly sheetName = 'servico';

  async listar(apenasAtivos = false): Promise<ServicoDTO[]> {
    const rows = await this.findAll();
    const result = rows.map((r) => mapServico(r));
    return apenasAtivos ? result.filter((s) => s.active) : result;
  }

  async buscarPorId(id: string): Promise<ServicoDTO | null> {
    const match = await this.findBy((r) => String(r.id ?? '') === id);
    return match ? mapServico(match.record) : null;
  }

  async criar(dados: Omit<ServicoDTO, 'id'>): Promise<ServicoDTO> {
    return this.criarComId(undefined, dados);
  }

  async criarComId(explicitId: string | undefined, dados: Omit<ServicoDTO, 'id'>): Promise<ServicoDTO> {
    const id = explicitId && explicitId.length > 0 ? explicitId : crypto.randomUUID();
    const now = new Date().toISOString();
    const values: InsertInput = {
      id,
      nome: dados.name,
      descricao: dados.description ?? '',
      duracao_minutos: dados.durationMin,
      preco: dados.price,
      categoria: dados.category ?? '',
      icon: dados.icon,
      ativo: dados.active !== false,
      created_at: now,
      updated_at: now,
    };
    await this.insert(values);
    return { ...dados, id };
  }

  async atualizar(id: string, dados: Partial<Omit<ServicoDTO, 'id'>>): Promise<ServicoDTO | null> {
    const updates: InsertInput = { updated_at: new Date().toISOString() };
    if (dados.name !== undefined) updates.nome = dados.name;
    if (dados.description !== undefined) updates.descricao = dados.description;
    if (dados.durationMin !== undefined) updates.duracao_minutos = dados.durationMin;
    if (dados.price !== undefined) updates.preco = dados.price;
    if (dados.category !== undefined) updates.categoria = dados.category;
    if (dados.icon !== undefined) updates.icon = dados.icon;
    if (dados.active !== undefined) updates.ativo = dados.active;
    const ok = await this.updateOne((r) => String(r.id ?? '') === id, updates);
    return ok ? this.buscarPorId(id) : null;
  }

  async excluir(id: string): Promise<boolean> {
    return this.deleteOne((r) => String(r.id ?? '') === id);
  }

  async substituirTodos(itens: ServicoRepositoryInput[]): Promise<ServicoDTO[]> {
    const current = await this.findAllIndexed();
    for (const row of current) {
      await this.deleteOne((r) => r.id === row.record.id).catch(() => undefined);
    }
    const created: ServicoDTO[] = [];
    for (const item of itens) {
      created.push(await this.criarComId(item.id, item));
    }
    return created;
  }
}

export async function criarRepoServico(): Promise<ServicoRepository> {
  return new ServicoRepository(getDb());
}
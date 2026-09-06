import getDb from '../database/connection';
import { SheetsRepository, InsertInput } from '../database/repository';
import type { SheetRow } from '../database/sheets-client';

export interface UsuarioRow extends SheetRow {}

export interface UsuarioDTO {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  telefone?: string;
  professionalId?: string;
  ativo: boolean;
  created_at?: string;
}

function toString(v: unknown): string {
  return v == null ? '' : String(v);
}

export class UsuarioRepository extends SheetsRepository {
  protected readonly sheetName = 'usuario';

  async listar(): Promise<SheetRow[]> {
    return this.findAll();
  }

  async listarDTOs(): Promise<UsuarioDTO[]> {
    const usuarios = await this.findAll();
    const vinculos = await this.buscarVinculos();
    const nomePorUsuario = await this.buscarNomes();
    const telefonePorUsuario = await this.buscarTelefones();
    return usuarios.map((u) => {
      const id = toString(u.id);
      const vinculo = vinculos.get(id);
      return {
        id,
        nome: nomePorUsuario.get(id) ?? '',
        email: toString(u.email),
        tipo: toString(u.tipo) || 'cliente',
        telefone: telefonePorUsuario.get(id) ?? undefined,
        professionalId: vinculo?.funcionarioId ?? undefined,
        ativo: true,
        created_at: u.created_at == null ? undefined : String(u.created_at),
      };
    });
  }

  private async buscarVinculos(): Promise<Map<string, { funcionarioId: string }>> {
    try {
      const funcRepo = new FuncionarioVinculoRepository(getDb());
      return await funcRepo.buscarPorUsuario();
    } catch {
      return new Map();
    }
  }

  private async buscarNomes(): Promise<Map<string, string>> {
    try {
      const clienteRepo = new ClienteNomesRepository(getDb());
      return await clienteRepo.buscarNomesPorUsuario();
    } catch {
      return new Map();
    }
  }

  private async buscarTelefones(): Promise<Map<string, string>> {
    try {
      const clienteRepo = new ClienteNomesRepository(getDb());
      return await clienteRepo.buscarTelefonesPorUsuario();
    } catch {
      return new Map();
    }
  }

  async buscarPorId(id: string): Promise<SheetRow | null> {
    return (await this.findBy((r) => String(r.id ?? '') === id))?.record ?? null;
  }

  async buscarPorEmail(email: string): Promise<SheetRow | null> {
    const normalized = email.trim().toLowerCase();
    return (
      (await this.findBy((r) => String(r.email ?? '').toLowerCase() === normalized))
        ?.record ?? null
    );
  }

  async criar(values: InsertInput): Promise<string> {
    const id = String(values.id ?? crypto.randomUUID());
    await this.insert({ ...values, id });
    return id;
  }

  async criarDados(dados: Omit<UsuarioDTO, 'id'>): Promise<UsuarioDTO> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await this.insert({
      id,
      email: dados.email.trim().toLowerCase(),
      tipo: dados.tipo || 'cliente',
      created_at: now,
      updated_at: now,
    });
    return { ...dados, id };
  }

  async criarClientePadrao(dados: {
    nome: string;
    email: string;
    telefone?: string;
  }): Promise<string> {
    const now = new Date().toISOString();
    const usuarioId = crypto.randomUUID();
    await this.insert({
      id: usuarioId,
      email: dados.email.trim().toLowerCase(),
      senha_hash: null,
      tipo: 'cliente',
      google_id: null,
      avatar_url: null,
      nome: dados.nome.trim(),
      telefone: dados.telefone ?? null,
      created_at: now,
      updated_at: now,
    });
    return usuarioId;
  }

  async criarUsuarioComSenha(dados: {
    nome: string;
    email: string;
    telefone?: string;
    senhaHash: string;
  }): Promise<string> {
    const now = new Date().toISOString();
    const usuarioId = crypto.randomUUID();
    await this.insert({
      id: usuarioId,
      email: dados.email.trim().toLowerCase(),
      senha_hash: dados.senhaHash,
      tipo: 'cliente',
      google_id: null,
      avatar_url: null,
      nome: dados.nome.trim(),
      telefone: dados.telefone ?? null,
      created_at: now,
      updated_at: now,
    });
    return usuarioId;
  }

  async atualizar(id: string, updates: InsertInput): Promise<boolean> {
    return this.updateOne((r) => String(r.id ?? '') === id, updates);
  }

  async atualizarSenha(id: string, senhaHash: string): Promise<boolean> {
    return this.updateOne((r) => String(r.id ?? '') === id, { senha_hash: senhaHash, updated_at: new Date().toISOString() });
  }

  async excluir(id: string): Promise<boolean> {
    return this.deleteOne((r) => String(r.id ?? '') === id);
  }
}

class ClienteNomesRepository extends SheetsRepository {
  protected readonly sheetName = 'cliente';

  async buscarNomesPorUsuario(): Promise<Map<string, string>> {
    const rows = await this.findAll();
    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(String(r.usuario_id ?? ''), toString(r.nome));
    }
    return map;
  }

  async buscarTelefonesPorUsuario(): Promise<Map<string, string>> {
    const rows = await this.findAll();
    const map = new Map<string, string>();
    for (const r of rows) {
      const tel = toString(r.telefone);
      if (tel) map.set(String(r.usuario_id ?? ''), tel);
    }
    return map;
  }
}

class FuncionarioVinculoRepository extends SheetsRepository {
  protected readonly sheetName = 'funcionario';

  async buscarPorUsuario(): Promise<Map<string, { funcionarioId: string }>> {
    const rows = await this.findAll();
    const map = new Map<string, { funcionarioId: string }>();
    for (const r of rows) {
      const usuarioId = toString(r.usuario_id);
      if (usuarioId) map.set(usuarioId, { funcionarioId: toString(r.id) });
    }
    return map;
  }
}

export async function criarRepoUsuario(): Promise<UsuarioRepository> {
  return new UsuarioRepository(getDb());
}

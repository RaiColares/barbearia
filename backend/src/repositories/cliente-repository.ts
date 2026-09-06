import getDb from '../database/connection';
import { SheetsRepository, InsertInput } from '../database/repository';
import type { SheetRow } from '../database/sheets-client';

export interface ClienteRow extends SheetRow {}

export class ClienteRepository extends SheetsRepository {
  protected readonly sheetName = 'cliente';

  async listar(): Promise<SheetRow[]> {
    return this.findAll();
  }

  async buscarPorId(id: string): Promise<SheetRow | null> {
    return (await this.findBy((r) => String(r.id ?? '') === id))?.record ?? null;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<SheetRow | null> {
    return (
      (await this.findBy((r) => String(r.usuario_id ?? '') === usuarioId))?.record ?? null
    );
  }

  async buscarPorEmail(email: string): Promise<SheetRow | null> {
    const normalized = email.trim().toLowerCase();
    const db = getDb();
    const usuarios = await db.readSheet('usuario');
    const usuario = usuarios.find(
      (u) => String(u.record.email ?? '').toLowerCase() === normalized,
    );
    if (!usuario) return null;
    return this.buscarPorUsuarioId(String(usuario.record.id ?? ''));
  }

  async criar(values: InsertInput): Promise<void> {
    await this.insert(values);
  }

  async atualizar(id: string, updates: InsertInput): Promise<boolean> {
    return this.updateOne((r) => String(r.id ?? '') === id, updates);
  }

  async excluir(id: string): Promise<boolean> {
    return this.deleteOne((r) => String(r.id ?? '') === id);
  }
}

export async function criarRepoCliente(): Promise<ClienteRepository> {
  return new ClienteRepository(getDb());
}
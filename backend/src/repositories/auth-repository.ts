import { randomUUID } from 'crypto';
import getDb from '../database/connection';
import type { SheetRow } from '../database/sheets-client';

const SHEET_USUARIO = 'usuario';
const SHEET_CLIENTE = 'cliente';
const SHEET_FUNCIONARIO = 'funcionario';

export interface UsuarioRow {
  id: string;
  email: string;
  senha_hash: string | null;
  tipo: string;
  google_id: string | null;
  avatar_url: string | null;
}

function mapUsuario(row: SheetRow): UsuarioRow {
  return {
    id: String(row.id ?? ''),
    email: String(row.email ?? ''),
    senha_hash: row.senha_hash != null ? String(row.senha_hash) : null,
    tipo: String(row.tipo ?? 'cliente'),
    google_id: row.google_id != null ? String(row.google_id) : null,
    avatar_url: row.avatar_url != null ? String(row.avatar_url) : null,
  };
}

function nowISO(): string {
  return new Date().toISOString();
}

export async function findUsuarioByEmail(email: string): Promise<UsuarioRow | null> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_USUARIO);
  const match = rows.find((r) => r.record.email === email);
  return match ? mapUsuario(match.record) : null;
}

export async function findUsuarioByGoogleId(googleId: string): Promise<UsuarioRow | null> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_USUARIO);
  const match = rows.find((r) => r.record.google_id === googleId);
  return match ? mapUsuario(match.record) : null;
}

export async function criarUsuarioGoogle(data: {
  email: string;
  googleId: string;
  nome: string;
  avatarUrl?: string | null;
}): Promise<UsuarioRow> {
  const db = getDb();
  const id = randomUUID();
  const now = nowISO();
  const headers = await db.getHeaders(SHEET_USUARIO);

  const record: Record<string, string | null> = {};
  for (const h of headers) {
    record[h] = null;
  }

  record.id = id;
  record.email = data.email;
  record.senha_hash = null;
  record.tipo = 'cliente';
  record.google_id = data.googleId;
  record.avatar_url = data.avatarUrl ?? null;
  record.created_at = now;
  record.updated_at = now;

  const rowValues = headers.map((h) => record[h] ?? null);
  await db.appendRow(SHEET_USUARIO, rowValues);
  db.dropCacheAll();

  return {
    id,
    email: data.email,
    senha_hash: null,
    tipo: 'cliente',
    google_id: data.googleId,
    avatar_url: data.avatarUrl ?? null,
  };
}

export async function vincularGoogleAUsuario(
  usuarioId: string,
  googleId: string,
  avatarUrl?: string | null,
): Promise<void> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_USUARIO);
  const match = rows.find((r) => r.record.id === usuarioId);
  if (!match) return;

  const headers = await db.getHeaders(SHEET_USUARIO);
  const updated = {
    ...match.record,
    google_id: googleId,
    avatar_url: avatarUrl ?? null,
    updated_at: nowISO(),
  };
  const rowValues = headers.map((h) =>
    h in updated ? updated[h as keyof typeof updated] ?? null : null,
  );
  await db.updateRow(SHEET_USUARIO, match.rowIndex, rowValues);
  db.dropCacheAll();
}

export async function criarCliente(data: {
  usuarioId: string;
  nome: string;
}): Promise<void> {
  const db = getDb();
  const id = randomUUID();
  const now = nowISO();
  const headers = await db.getHeaders(SHEET_CLIENTE);

  const record: Record<string, string | null> = {};
  for (const h of headers) record[h] = null;

  record.id = id;
  record.usuario_id = data.usuarioId;
  record.nome = data.nome;
  record.created_at = now;
  record.updated_at = now;

  const rowValues = headers.map((h) => record[h] ?? null);
  await db.appendRow(SHEET_CLIENTE, rowValues);
  db.dropCacheAll();
}

export async function obterClienteNome(usuarioId: string): Promise<string | null> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_CLIENTE);
  const match = rows.find((r) => r.record.usuario_id === usuarioId);
  return match ? String(match.record.nome ?? '') : null;
}

export async function obterFuncionarioNome(
  usuarioId: string,
): Promise<{ nome: string; cargo: string } | null> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_FUNCIONARIO);
  const match = rows.find((r) => r.record.usuario_id === usuarioId);
  if (!match) return null;
  return {
    nome: String(match.record.nome ?? ''),
    cargo: String(match.record.cargo ?? ''),
  };
}
import { CONFIG } from "../config.js";
import { isMockMode, httpJson } from "./api.js";
import type { UserRole } from "../types.js";

export interface UsuarioInterno {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: "profissional" | "recepcionista";
  professionalId?: string;
  createdAt: string;
}

interface UsuarioAPI {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  professionalId?: string;
  createdAt?: string;
}

let usuariosCache: UsuarioInterno[] | null = null;

function readList(): UsuarioInterno[] {
  const raw = localStorage.getItem(CONFIG.usuariosKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as UsuarioInterno[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(list: UsuarioInterno[]): void {
  localStorage.setItem(CONFIG.usuariosKey, JSON.stringify(list));
}

function mapFromAPI(api: UsuarioAPI): UsuarioInterno {
  return {
    id: api.id,
    nome: api.nome || "",
    email: api.email,
    senha: "",
    role: api.tipo === "recepcionista" ? "recepcionista" : "profissional",
    professionalId: api.professionalId,
    createdAt: api.createdAt || "",
  };
}

async function loadRemote(): Promise<UsuarioInterno[]> {
  try {
    const data = await httpJson<UsuarioAPI[]>("/usuarios");
    usuariosCache = data.map(mapFromAPI);
    return usuariosCache;
  } catch {
    return [];
  }
}

export function listUsuariosInternos(): UsuarioInterno[] {
  if (usuariosCache) return usuariosCache;
  if (isMockMode()) return readList();
  return readList();
}

export async function ensureUsuariosLoaded(): Promise<void> {
  if (isMockMode()) return;
  if (usuariosCache) return;
  await loadRemote();
}

export function findUsuarioByEmail(email: string): UsuarioInterno | null {
  const normalized = email.trim().toLowerCase();
  return listUsuariosInternos().find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export function validateUsuarioInterno(
  email: string,
  senha: string,
): UsuarioInterno | null {
  const usuario = findUsuarioByEmail(email);
  if (!usuario) return null;
  return usuario.senha === senha ? usuario : null;
}

export async function createUsuarioInterno(data: {
  nome: string;
  email: string;
  senha: string;
  role: "profissional" | "recepcionista";
  professionalId?: string;
}): Promise<UsuarioInterno> {
  if (isMockMode()) {
    const usuario: UsuarioInterno = {
      id: `USR-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      senha: data.senha,
      role: data.role,
      professionalId: data.professionalId,
      createdAt: new Date().toISOString(),
    };
    writeList([...readList(), usuario]);
    return usuario;
  }
  const created = await httpJson<UsuarioAPI>("/usuarios", {
    method: "POST",
    body: JSON.stringify({
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      tipo: data.role,
      professionalId: data.professionalId,
      password: data.senha,
    }),
  });
  const mapped = mapFromAPI(created);
  mapped.senha = data.senha;
  usuariosCache = [...(usuariosCache ?? []), mapped];
  return mapped;
}

export async function updateUsuarioInterno(id: string, data: { nome?: string; email?: string; senha?: string }): Promise<UsuarioInterno | null> {
  if (isMockMode()) {
    const list = readList();
    const index = list.findIndex((u) => u.id === id);
    if (index < 0) return null;
    const current = list[index]!;
    const updated: UsuarioInterno = {
      ...current,
      nome: data.nome !== undefined ? data.nome.trim() : current.nome,
      email: data.email !== undefined ? data.email.trim().toLowerCase() : current.email,
      senha: data.senha !== undefined ? data.senha : current.senha,
    };
    list[index] = updated;
    writeList(list);
    return updated;
  }
  const patchBody: Record<string, string> = {};
  if (data.senha) patchBody.password = data.senha;
  if (data.nome !== undefined) patchBody.nome = data.nome.trim();
  if (data.email !== undefined) patchBody.email = data.email.trim().toLowerCase();
  if (Object.keys(patchBody).length > 0) {
    await httpJson(`/usuarios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patchBody),
    });
  }
  usuariosCache = null;
  await loadRemote();
  return listUsuariosInternos().find((u) => u.id === id) ?? null;
}

export function findByProfessionalId(professionalId: string): UsuarioInterno | null {
  return listUsuariosInternos().find((u) => u.professionalId === professionalId) ?? null;
}

export async function deleteUsuarioInterno(id: string): Promise<void> {
  if (isMockMode()) {
    writeList(readList().filter((u) => u.id !== id));
    return;
  }
  await httpJson(`/usuarios/${id}`, { method: "DELETE" });
  usuariosCache = null;
  await loadRemote();
}

export function roleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    superusuario: "Superusuário",
    admin: "Administrador",
    recepcionista: "Recepcionista",
    profissional: "Profissional",
    cliente: "Cliente",
  };
  return map[role] ?? "Usuário";
}
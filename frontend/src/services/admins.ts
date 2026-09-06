import { CONFIG } from "../config.js";
import { isMockMode, httpJson } from "./api.js";

export interface AdminProfile {
  id: string;
  nome: string;
  email: string;
  senha: string;
  createdAt: string;
}

const LEGACY_ADMIN_KEY = "maraca.v2.demoAdmin";

interface UsuarioAPI {
  id: string;
  nome: string;
  email: string;
  tipo: string;
}

let adminsCache: AdminProfile[] | null = null;

function readList(): AdminProfile[] {
  const raw = localStorage.getItem(CONFIG.adminsKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AdminProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(list: AdminProfile[]): void {
  localStorage.setItem(CONFIG.adminsKey, JSON.stringify(list));
}

function createId(): string {
  return `ADM-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function mapFromAPI(api: UsuarioAPI): AdminProfile {
  return {
    id: api.id,
    nome: api.nome || "",
    email: api.email,
    senha: "",
    createdAt: "",
  };
}

async function ensureLoaded(): Promise<void> {
  if (adminsCache) return;
  if (!isMockMode()) {
    try {
      const data = await httpJson<UsuarioAPI[]>("/usuarios");
      adminsCache = data.map(mapFromAPI);
      return;
    } catch {
      /* fallback abaixo */
    }
  }
  const list = readList();
  if (list.length > 0) {
    adminsCache = list;
    return;
  }
  const legacyRaw = localStorage.getItem(LEGACY_ADMIN_KEY);
  let migrated: AdminProfile | null = null;
  if (legacyRaw) {
    try {
      const parsed = JSON.parse(legacyRaw) as { nome?: string; email?: string; senha?: string };
      if (parsed && typeof parsed.nome === "string" && typeof parsed.email === "string" && typeof parsed.senha === "string") {
        migrated = {
          id: createId(),
          nome: parsed.nome,
          email: parsed.email.trim().toLowerCase(),
          senha: parsed.senha,
          createdAt: new Date().toISOString(),
        };
      }
    } catch {
      /* ignore */
    }
  }
  const seed = migrated ?? {
    id: createId(),
    nome: CONFIG.demoAdmin.name,
    email: CONFIG.demoAdmin.email,
    senha: CONFIG.demoAdmin.password,
    createdAt: new Date().toISOString(),
  };
  adminsCache = [seed];
  if (isMockMode()) {
    writeList([seed]);
    localStorage.removeItem(LEGACY_ADMIN_KEY);
  }
}

export function listAdmins(): AdminProfile[] {
  return adminsCache ?? [];
}

export async function loadAdminsRemote(): Promise<AdminProfile[]> {
  await ensureLoaded();
  return listAdmins();
}

export function findAdminByEmail(email: string): AdminProfile | null {
  const normalized = email.trim().toLowerCase();
  return listAdmins().find((a) => a.email.toLowerCase() === normalized) ?? null;
}

export function validateAdminLogin(email: string, senha: string): AdminProfile | null {
  const admin = findAdminByEmail(email);
  if (!admin) return null;
  return admin.senha === senha ? admin : null;
}

export async function createAdmin(data: { nome: string; email: string; senha: string }): Promise<AdminProfile> {
  const admin: AdminProfile = {
    id: createId(),
    nome: data.nome.trim(),
    email: data.email.trim().toLowerCase(),
    senha: data.senha,
    createdAt: new Date().toISOString(),
  };
  if (isMockMode()) {
    writeList([...readList(), admin]);
    adminsCache = [...listAdmins(), admin];
    return admin;
  }
  const created = await httpJson<UsuarioAPI>("/usuarios", {
    method: "POST",
    body: JSON.stringify({
      nome: admin.nome,
      email: admin.email,
      tipo: "admin",
      password: "admin",
    }),
  });
  const mapped = mapFromAPI(created);
  mapped.senha = data.senha;
  adminsCache = [...listAdmins(), mapped];
  return mapped;
}

export async function updateAdmin(id: string, data: { nome?: string; email?: string; senha?: string }): Promise<AdminProfile | null> {
  const list = listAdmins();
  const index = list.findIndex((a) => a.id === id);
  if (index < 0) return null;
  const current = list[index]!;
  const updated: AdminProfile = {
    ...current,
    nome: data.nome !== undefined ? data.nome.trim() : current.nome,
    email: data.email !== undefined ? data.email.trim().toLowerCase() : current.email,
    senha: data.senha !== undefined ? data.senha : current.senha,
  };
  if (isMockMode()) {
    const local = readList().map((a) => (a.id === id ? updated : a));
    writeList(local);
    adminsCache = local;
    return updated;
  }
  const body: Record<string, string> = {};
  if (data.nome !== undefined) body.nome = updated.nome;
  if (data.email !== undefined) body.email = updated.email;
  if (data.senha !== undefined) body.password = data.senha;
  const saved = await httpJson<UsuarioAPI>(`/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const mapped = mapFromAPI(saved);
  mapped.senha = updated.senha;
  list[index] = mapped;
  adminsCache = [...list];
  return mapped;
}

export async function deleteAdmin(id: string): Promise<void> {
  if (isMockMode()) {
    const list = readList().filter((a) => a.id !== id);
    writeList(list);
    adminsCache = list;
    return;
  }
  await httpJson(`/usuarios/${id}`, { method: "DELETE" });
  adminsCache = listAdmins().filter((a) => a.id !== id);
}

export function isLastAdmin(): boolean {
  return listAdmins().length <= 1;
}
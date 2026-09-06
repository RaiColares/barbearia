import { CONFIG } from "../config.js";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 0,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

export const isMockMode = (): boolean => CONFIG.useMockApi;

function getAuthToken(): string | null {
  try {
    const raw = sessionStorage.getItem(CONFIG.sessionKey);
    if (!raw) return null;
    const session = JSON.parse(raw) as { token?: string };
    return session.token ?? null;
  } catch {
    return null;
  }
}

export async function httpJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    response = await fetch(`${CONFIG.apiBaseUrl}${path}`, {
      headers,
      ...init,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }
  if (!response.ok) {
    const message =
      response.status === 401 || response.status === 403
        ? "Credenciais inválidas. Verifique e tente novamente."
        : `Erro na requisição (${response.status}). Tente novamente.`;
    throw new ApiError(message, response.status);
  }
  return (await response.json()) as T;
}

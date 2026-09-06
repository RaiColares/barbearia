import type { Professional, Service } from "../types.js";
import { CONFIG } from "../config.js";
import { isMockMode, httpJson } from "./api.js";

export const DEFAULT_CATEGORIES: string[] = [];

let servicesCache: Service[] | null = null;
let professionalsCache: Professional[] | null = null;
let categoriesCache: string[] | null = null;

function readList<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]): void {
  localStorage.setItem(key, JSON.stringify(list));
}

async function loadServicesRemote(): Promise<Service[]> {
  const services = await httpJson<Service[]>("/servicos?ativos=true");
  servicesCache = services;
  return services;
}

async function loadProfessionalsRemote(): Promise<Professional[]> {
  try {
    const professionals = await httpJson<Professional[]>("/profissionais");
    professionalsCache = professionals;
    return professionals;
  } catch {
    return [];
  }
}

export function loadServices(): Service[] {
  if (servicesCache) return servicesCache;
  if (isMockMode()) return readList<Service>(CONFIG.servicesKey);
  return readList<Service>(CONFIG.servicesKey);
}

export async function ensureCatalogLoaded(): Promise<void> {
  if (isMockMode()) return;
  if (servicesCache && professionalsCache) return;
  await Promise.allSettled([loadServicesRemote(), loadProfessionalsRemote()]);
}

export function saveServices(services: Service[]): void {
  servicesCache = services;
  if (isMockMode()) {
    writeList(CONFIG.servicesKey, services);
    return;
  }
  void httpJson("/servicos", { method: "PUT", body: JSON.stringify(services) });
}

export function loadProfessionals(): Professional[] {
  if (professionalsCache) return professionalsCache;
  return readList<Professional>(CONFIG.professionalsKey);
}

export function saveProfessionals(professionals: Professional[]): void {
  professionalsCache = professionals;
  if (isMockMode()) {
    writeList(CONFIG.professionalsKey, professionals);
    return;
  }
  void httpJson("/profissionais", { method: "PUT", body: JSON.stringify(professionals) });
}

export function loadCategories(): string[] {
  if (categoriesCache) return [...categoriesCache];
  const fromMock = isMockMode() ? readList<string>(CONFIG.categoriesKey) : [];
  const fromServices = servicesCache ? Array.from(new Set(servicesCache.map((s) => s.category).filter(Boolean))) : [];
  const merged = fromMock.length > 0 ? fromMock : fromServices;
  if (merged.length > 0) {
    categoriesCache = [...merged];
  }
  return merged.length > 0 ? [...merged] : [...DEFAULT_CATEGORIES];
}

export function saveCategories(categories: string[]): void {
  categoriesCache = [...categories];
  if (isMockMode()) {
    writeList(CONFIG.categoriesKey, categories);
  }
}
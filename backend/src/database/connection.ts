import { SheetsClient } from './sheets-client';

function buildPrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  // Suporta chave em uma linha (.env tradicional) e com \n escapado
  return raw.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

const isConfigured = Boolean(
  process.env.GOOGLE_SPREADSHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY,
);

const db: SheetsClient | null = isConfigured
  ? new SheetsClient({
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      privateKey: buildPrivateKey(process.env.GOOGLE_PRIVATE_KEY),
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
    })
  : null;

export function getDb(): SheetsClient {
  if (!db) {
    throw new Error(
      'Google Sheets não configurado. Defina GOOGLE_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY no .env',
    );
  }
  return db;
}

export default getDb;
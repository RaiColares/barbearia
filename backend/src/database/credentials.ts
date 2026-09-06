import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const ENV_PATH =
  process.env.DOTENV_CONFIG_PATH ||
  path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: ENV_PATH });

export interface ServiceAccountCredentials {
  serviceAccountEmail: string;
  privateKey: string;
}

export function buildPrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  return raw.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
}

export function loadServiceAccountCredentials(): ServiceAccountCredentials {
  const envEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const envKey = process.env.GOOGLE_PRIVATE_KEY;

  if (envEmail && envKey) {
    return {
      serviceAccountEmail: envEmail,
      privateKey: buildPrivateKey(envKey),
    };
  }

  const filePath =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    findServiceAccountFile();
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw) as {
      client_email?: string;
      private_key?: string;
    };
    if (json.client_email && json.private_key) {
      return {
        serviceAccountEmail: json.client_email,
        privateKey: json.private_key,
      };
    }
  }

  throw new Error(
    'Credenciais do Google não configuradas. Preencha variáveis GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_PRIVATE_KEY no .env ou salve o JSON em backend/config/service-account.json',
  );
}

function findServiceAccountFile(): string {
  const candidates = [
    path.resolve(__dirname, '..', '..', 'config', 'service-account.json'),
    path.resolve(__dirname, '..', 'config', 'service-account.json'),
    path.resolve(process.cwd(), 'config', 'service-account.json'),
    path.resolve(process.cwd(), 'backend', 'config', 'service-account.json'),
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  return found || candidates[0];
}
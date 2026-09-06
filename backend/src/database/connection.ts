import path from 'path';
import dotenv from 'dotenv';
import { SheetsClient } from './sheets-client';
import {
  buildPrivateKey,
  loadServiceAccountCredentials,
} from './credentials';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SPREADSHEET_ID;
  if (!id) {
    throw new Error(
      'Variável de ambiente ausente: GOOGLE_SPREADSHEET_ID. Cole o ID da planilha no backend/.env',
    );
  }
  return id;
}

export function getDb(): SheetsClient {
  const spreadsheetId = getSpreadsheetId();
  const creds = loadServiceAccountCredentials();
  return new SheetsClient({
    serviceAccountEmail: creds.serviceAccountEmail,
    privateKey: buildPrivateKey(creds.privateKey),
    spreadsheetId,
  });
}

export default getDb;
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import {
  loadServiceAccountCredentials,
  buildPrivateKey,
} from './database/credentials';

const SHEET_USUARIO = 'usuario';
const SHEET_FUNCIONARIO = 'funcionario';

function nowISO(): string {
  return new Date().toISOString();
}

async function main(): Promise<void> {
  const creds = loadServiceAccountCredentials();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.error('Configure GOOGLE_SPREADSHEET_ID no .env');
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: creds.serviceAccountEmail,
    key: buildPrivateKey(creds.privateKey),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const email = process.env.SUPER_EMAIL || 'super@barbearia.com';
  const senha = process.env.SUPER_SENHA || 'senha123';
  const nome = process.env.SUPER_NOME || 'Super Usuário';

  const usuarios = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_USUARIO}!A2:H10000`,
  });
  const emails = (usuarios.data.values ?? []).map((row) => String(row[1] ?? ''));
  if (emails.includes(email)) {
    console.log(`Usuário ${email} já existe. Encerrando.`);
    return;
  }

  const hash = await bcrypt.hash(senha, 10);
  const usuarioId = randomUUID();
  const now = nowISO();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_USUARIO}!A:H`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[usuarioId, email, hash, 'funcionario', null, null, now, now]],
    },
  });

  const funcionarioId = randomUUID();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_FUNCIONARIO}!A:K`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[funcionarioId, usuarioId, nome, null, 'superusuario', null, null, null, true, now, now]],
    },
  });

  console.log(`✅ Superusuário criado: ${email} / ${senha}`);
}

main().catch((error) => {
  console.error('Erro:', error);
  process.exit(1);
});
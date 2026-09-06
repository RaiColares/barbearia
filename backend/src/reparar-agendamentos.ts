import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import {
  loadServiceAccountCredentials,
  buildPrivateKey,
} from './database/credentials';

const CODE_LETTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomChar(source: string): string {
  const bytes = new Uint8Array(1);
  crypto.getRandomValues(bytes);
  return source.charAt(bytes[0]! % source.length);
}

function generateCode(existing: Set<string>): string {
  for (let attempt = 0; attempt < 60; attempt++) {
    let code = '';
    code += randomChar(CODE_LETTERS);
    code += randomChar(CODE_LETTERS);
    code += '-';
    for (let i = 0; i < 5; i++) code += randomChar(CODE_CHARS);
    if (!existing.has(code)) return code;
  }
  return `XX-${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

type Value = string | number | boolean | null;

async function main(): Promise<void> {
  const creds = loadServiceAccountCredentials();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('GOOGLE_SPREADSHEET_ID ausente');
  const auth = new google.auth.JWT({
    email: creds.serviceAccountEmail,
    key: buildPrivateKey(creds.privateKey),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const getRows = async (range: string): Promise<Value[][]> => {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });
    return (res.data.values ?? []).slice(1) as Value[][];
  };

  const clientes = await getRows('cliente!A2:E10000');
  const funcionarios = await getRows('funcionario!A2:K10000');
  const servicos = await getRows('servico!A2:H10000');

  const cliente = clientes.map((r) => String(r[0]));
  const funcIds = funcionarios.map((r) => String(r[0]));
  const servIds = servicos.map((r) => String(r[0]));

  const existing = new Set<string>();

  const rows: Value[][] = [
    [uuidv4(), generateCode(existing), cliente[0], funcIds[0], servIds[2], '2026-09-08', '10:00', 'confirmado', '', nowISO(), nowISO()],
    [uuidv4(), generateCode(existing), cliente[1], funcIds[1], servIds[0], '2026-09-08', '14:00', 'pendente', '', nowISO(), nowISO()],
    [uuidv4(), generateCode(existing), cliente[0], funcIds[0], servIds[1], '2026-09-09', '09:00', 'pendente', 'Barba cheia', nowISO(), nowISO()],
    [uuidv4(), generateCode(existing), cliente[1], funcIds[0], servIds[3], '2026-09-09', '11:00', 'confirmado', '', nowISO(), nowISO()],
    [uuidv4(), generateCode(existing), cliente[0], funcIds[1], servIds[4], '2026-09-10', '16:00', 'pendente', '', nowISO(), nowISO()],
  ];

  // Limpar aba agendamento (após header)
  const sheet = sheets.spreadsheets.get({ spreadsheetId, ranges: ['agendamento'] });
  const sheetInfo = (await sheets.spreadsheets.get({ spreadsheetId, ranges: ['agendamento'] })).data.sheets?.find((s) => s.properties?.title === 'agendamento');
  const sheetId = sheetInfo?.properties?.sheetId;
  if (sheetId == null) throw new Error('Aba agendamento não encontrada');
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: 1, endIndex: 10000 },
          },
        },
      ],
    },
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'agendamento!A2:K2',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  console.log(`✅ Aba agendamento reconstruída com ${rows.length} agendamentos corrigidos.`);
  void sheet;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
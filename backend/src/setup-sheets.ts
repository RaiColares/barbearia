import { google, sheets_v4 } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

interface SheetDef {
  name: string;
  headers: string[];
}

const SCHEMA: SheetDef[] = [
  {
    name: 'usuario',
    headers: [
      'id', 'email', 'senha_hash', 'tipo', 'google_id',
      'avatar_url', 'created_at', 'updated_at',
    ],
  },
  {
    name: 'cliente',
    headers: ['id', 'usuario_id', 'nome', 'telefone', 'created_at', 'updated_at'],
  },
  {
    name: 'funcionario',
    headers: [
      'id', 'usuario_id', 'nome', 'telefone', 'cargo', 'especialidade',
      'foto', 'descricao', 'ativo', 'created_at', 'updated_at',
    ],
  },
  {
    name: 'servico',
    headers: [
      'id', 'nome', 'descricao', 'duracao_minutos', 'preco',
      'ativo', 'created_at', 'updated_at',
    ],
  },
  {
    name: 'horario_trabalho',
    headers: [
      'id', 'funcionario_id', 'dia_semana', 'hora_inicio', 'hora_fim',
      'ativo', 'created_at', 'updated_at',
    ],
  },
  {
    name: 'horario_excecao',
    headers: [
      'id', 'funcionario_id', 'data', 'hora_inicio', 'hora_fim',
      'tipo', 'motivo', 'created_at', 'updated_at',
    ],
  },
  {
    name: 'agendamento',
    headers: [
      'id', 'cliente_id', 'funcionario_id', 'servico_id', 'data',
      'hora', 'status', 'observacao', 'created_at', 'updated_at',
    ],
  },
];

function buildPrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  return raw.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
}

async function main(): Promise<void> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !key || !spreadsheetId) {
    console.error('Configure GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY e GOOGLE_SPREADSHEET_ID no .env');
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email,
    key: buildPrivateKey(key),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Verificando planilha existente...');
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheets = spreadsheet.data.sheets?.map((s) => s.properties?.title) ?? [];

  const sheetsToAdd: { properties: { title: string } }[] = [];

  for (const def of SCHEMA) {
    if (existingSheets.includes(def.name)) {
      console.log(`  Aba "${def.name}" já existe — pulando`);
      continue;
    }
    console.log(`  Criando aba "${def.name}"...`);
    sheetsToAdd.push({ properties: { title: def.name } });
  }

  if (sheetsToAdd.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: sheetsToAdd.map((s) => ({ addSheet: s })) },
    });
    console.log(`${sheetsToAdd.length} aba(s) criada(s).`);
  }

  // Preencher cabeçalhos nas abas novas
  const data: { range: string; majorDimension: 'ROWS'; values: string[][] }[] = [];
  for (const def of SCHEMA) {
    data.push({
      range: `${def.name}!A1:Z1`,
      majorDimension: 'ROWS',
      values: [def.headers],
    });
  }

  const batchParams: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdate = {
    spreadsheetId,
    requestBody: { valueInputOption: 'USER_ENTERED', data },
  };
  await sheets.spreadsheets.values.batchUpdate(batchParams);

  console.log('Cabeçalhos atualizados em todas as abas.');
  console.log('✅ Planilha inicializada com sucesso!');
}

main().catch((error) => {
  console.error('Erro ao inicializar planilha:', error);
  process.exit(1);
});
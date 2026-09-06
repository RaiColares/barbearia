import { google, sheets_v4 } from 'googleapis';
import {
  loadServiceAccountCredentials,
  buildPrivateKey,
} from './database/credentials';

interface SheetDef {
  name: string;
  headers: string[];
}

const SCHEMA: SheetDef[] = [
  {
    name: 'usuario',
    headers: [
      'id', 'email', 'senha_hash', 'tipo', 'google_id',
      'avatar_url', 'nome', 'telefone', 'professional_id', 'created_at', 'updated_at',
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
      'id', 'nome', 'descricao', 'categoria', 'icon', 'duracao_minutos', 'preco',
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
      'id', 'code', 'cliente_id', 'funcionario_id', 'servico_id', 'data',
      'hora', 'status', 'observacao', 'created_at', 'updated_at',
    ],
  },
];

async function main(): Promise<void> {
  let creds;
  try {
    creds = loadServiceAccountCredentials();
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.error(
      'Configure GOOGLE_SPREADSHEET_ID no .env (ID da planilha)',
    );
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: creds.serviceAccountEmail,
    key: buildPrivateKey(creds.privateKey),
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

  // Garantir colunas novas em abas antigas (ex.: "code" no agendamento)
  for (const def of SCHEMA) {
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${def.name}!A1:Z1`,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });
    const currentHeaders = existing.data.values?.[0]?.map((c: unknown) => String(c)) ?? [];
    const missing = def.headers.filter((h) => !currentHeaders.includes(h));
    if (missing.length > 0) {
      const startCol = currentHeaders.length + 1;
      const range = `${def.name}!${String.fromCharCode(64 + startCol)}1`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          majorDimension: 'ROWS',
          values: [[missing[0]]],
        },
      });
      console.log(`  Coluna "${missing[0]}" adicionada em "${def.name}".`);
    }
  }

  console.log('✅ Planilha inicializada com sucesso!');
}

main().catch((error) => {
  console.error('Erro ao inicializar planilha:', error);
  process.exit(1);
});
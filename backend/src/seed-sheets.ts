import { google, sheets_v4 } from 'googleapis';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import {
  loadServiceAccountCredentials,
  buildPrivateKey,
} from './database/credentials';

type CellValue = string | number | boolean | null;

function nowISO(): string {
  return new Date().toISOString();
}

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
    console.error('Configure GOOGLE_SPREADSHEET_ID no .env');
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: creds.serviceAccountEmail,
    key: buildPrivateKey(creds.privateKey),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Verificando dados existentes...');
  const usuariosResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'usuario!A1:A10000',
  });
  const existingRows = usuariosResponse.data.values?.length ?? 0;
  if (existingRows > 1) {
    console.log('Planilha já possui dados. Abortando seed.');
    process.exit(0);
  }

  const hash = await bcrypt.hash('senha123', 10);

  const usuarios: CellValue[][] = [
    [randomUUID(), 'super@barbearia.com', hash, 'funcionario', null, null, nowISO(), nowISO()],
    [randomUUID(), 'rafael@barbearia.com', hash, 'funcionario', null, null, nowISO(), nowISO()],
    [randomUUID(), 'marcos@barbearia.com', hash, 'funcionario', null, null, nowISO(), nowISO()],
    [randomUUID(), 'juliana@barbearia.com', hash, 'funcionario', null, null, nowISO(), nowISO()],
    [randomUUID(), 'admin@barbearia.com', hash, 'funcionario', null, null, nowISO(), nowISO()],
    [randomUUID(), 'carlos@email.com', hash, 'cliente', null, null, nowISO(), nowISO()],
    [randomUUID(), 'ana@email.com', hash, 'cliente', null, null, nowISO(), nowISO()],
  ];

  const funcionarios: CellValue[][] = [
    [randomUUID(), usuarios[1][0], 'Rafael Silva', '(11) 99999-1111', 'barbeiro', 'Corte masculino', null, 'Especialista em degradê', true, nowISO(), nowISO()],
    [randomUUID(), usuarios[2][0], 'Marcos Souza', '(11) 99999-2222', 'barbeiro', 'Barba e corte', null, 'Faz as melhores barbas', true, nowISO(), nowISO()],
    [randomUUID(), usuarios[3][0], 'Juliana Costa', '(11) 99999-3333', 'recepcionista', null, null, null, true, nowISO(), nowISO()],
    [randomUUID(), usuarios[4][0], 'Admin Maraca', '(11) 99999-4444', 'administrador', null, null, null, true, nowISO(), nowISO()],
    [randomUUID(), usuarios[0][0], 'Super Maraca', '(11) 99999-5555', 'superusuario', null, null, null, true, nowISO(), nowISO()],
  ];

  const clientes: CellValue[][] = [
    [randomUUID(), usuarios[5][0], 'Carlos Oliveira', '(11) 88888-1111', nowISO(), nowISO()],
    [randomUUID(), usuarios[6][0], 'Ana Pereira', '(11) 88888-2222', nowISO(), nowISO()],
  ];

  const servicos: CellValue[][] = [
    [randomUUID(), 'Corte masculino', 'Corte tesoura ou máquina', 30, 45.0, true, nowISO(), nowISO()],
    [randomUUID(), 'Barba', 'Barba com navalha e toalha quente', 20, 30.0, true, nowISO(), nowISO()],
    [randomUUID(), 'Corte + Barba', 'Combo corte masculino e barba', 45, 70.0, true, nowISO(), nowISO()],
    [randomUUID(), 'Pigmentação', 'Pigmentação capilar e barba', 40, 80.0, true, nowISO(), nowISO()],
    [randomUUID(), 'Sobrancelha', 'Design de sobrancelha', 15, 20.0, true, nowISO(), nowISO()],
  ];

  const horariosTrabalho: CellValue[][] = [];
  for (const func of funcionarios) {
    for (let dia = 1; dia <= 6; dia++) {
      horariosTrabalho.push([
        randomUUID(), func[0], dia, '09:00', '19:00', true, nowISO(), nowISO(),
      ]);
    }
  }

  const agendamentos: CellValue[][] = [
    [randomUUID(), clientes[0][0], funcionarios[0][0], servicos[2][0], '2026-09-08', '10:00', 'confirmado', null, nowISO(), nowISO()],
    [randomUUID(), clientes[1][0], funcionarios[1][0], servicos[0][0], '2026-09-08', '14:00', 'pendente', null, nowISO(), nowISO()],
    [randomUUID(), clientes[0][0], funcionarios[0][0], servicos[1][0], '2026-09-09', '09:00', 'pendente', 'Barba cheia', nowISO(), nowISO()],
    [randomUUID(), clientes[1][0], funcionarios[0][0], servicos[3][0], '2026-09-09', '11:00', 'confirmado', null, nowISO(), nowISO()],
    [randomUUID(), clientes[0][0], funcionarios[1][0], servicos[4][0], '2026-09-10', '16:00', 'pendente', null, nowISO(), nowISO()],
  ];

  console.log('Inserindo dados...');

  const requestBody: sheets_v4.Schema$BatchUpdateValuesRequest = {
    data: [
      { range: 'usuario!A2', majorDimension: 'ROWS', values: usuarios as string[][] },
      { range: 'funcionario!A2', majorDimension: 'ROWS', values: funcionarios as string[][] },
      { range: 'cliente!A2', majorDimension: 'ROWS', values: clientes as string[][] },
      { range: 'servico!A2', majorDimension: 'ROWS', values: servicos as string[][] },
      { range: 'horario_trabalho!A2', majorDimension: 'ROWS', values: horariosTrabalho as string[][] },
      { range: 'agendamento!A2', majorDimension: 'ROWS', values: agendamentos as string[][] },
    ],
  };

  const batchParams: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdate = {
    spreadsheetId,
    requestBody: { valueInputOption: 'USER_ENTERED', ...requestBody },
  };
  await sheets.spreadsheets.values.batchUpdate(batchParams);

  console.log('✅ Seed concluído!');
  console.log(`   - ${usuarios.length} usuários`);
  console.log(`   - ${funcionarios.length} funcionários`);
  console.log(`   - ${clientes.length} clientes`);
  console.log(`   - ${servicos.length} serviços`);
  console.log(`   - ${horariosTrabalho.length} horários de trabalho`);
  console.log(`   - ${agendamentos.length} agendamentos`);
  console.log('\nCredenciais:');
  console.log('   super@barbearia.com / senha123  (superusuario)');
  console.log('   admin@barbearia.com / senha123');
  console.log('   rafael@barbearia.com / senha123');
  console.log('   carlos@email.com / senha123');
}

main().catch((error) => {
  console.error('Erro ao executar seed:', error);
  process.exit(1);
});
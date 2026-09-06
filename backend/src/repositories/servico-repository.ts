import getDb from '../database/connection';
import type { ServicoDTO } from '../dtos/servico-dto';

const SHEET_NAME = 'servico';

function mapServico(record: Record<string, unknown>): ServicoDTO {
  return {
    id: String(record.id ?? ''),
    nome: String(record.nome ?? ''),
    preco: String(record.preco ?? '0'),
    duracao: Number(record.duracao_minutos ?? 0),
  };
}

export async function listarServicosAtivos(): Promise<ServicoDTO[]> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_NAME);

  return rows
    .filter(
      (r) =>
        r.record.ativo === true ||
        r.record.ativo === 'TRUE' ||
        r.record.ativo === 'true',
    )
    .map((r) => mapServico({ ...r.record }));
}

export async function listarTodosServicos(): Promise<ServicoDTO[]> {
  const db = getDb();
  const rows = await db.readSheet(SHEET_NAME);

  return rows.map((r) => mapServico({ ...r.record }));
}
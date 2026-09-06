import { Request, Response } from 'express';
import {
  obterHorariosPorProfissional,
  substituirHorarios,
} from '../services/horario-trabalho-service';
import { ValidationError } from '../errors/ValidationError';

export async function listarPorProfissional(req: Request, res: Response): Promise<void> {
  try {
    const profissionalId = String(req.params?.profissionalId ?? '');
    if (!profissionalId) throw new ValidationError('profissionalId é obrigatório');
    res.json(await obterHorariosPorProfissional(profissionalId));
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao listar' });
  }
}

export async function substituir(req: Request, res: Response): Promise<void> {
  try {
    const profissionalId = String(req.params?.profissionalId ?? '');
    if (!profissionalId) throw new ValidationError('profissionalId é obrigatório');
    const payload = req.body as Array<{
      diaSemana?: number | string;
      horaInicio?: string;
      horaFim?: string;
      ativo?: boolean;
    }>;
    if (!Array.isArray(payload)) throw new ValidationError('Corpo deve ser uma lista');
    const resultado = await substituirHorarios(
      profissionalId,
      payload.map((h) => ({
        diaSemana: h.diaSemana ?? 0,
        horaInicio: String(h.horaInicio ?? ''),
        horaFim: String(h.horaFim ?? ''),
        ativo: h.ativo !== false,
      })),
    );
    res.json(resultado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao substituir' });
  }
}
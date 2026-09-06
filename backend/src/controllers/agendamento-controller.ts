import { Request, Response } from 'express';
import {
  criarAgendamento,
  listarAgendamentos,
  buscarAgendamentoPorCode,
  cancelarAgendamento,
  atualizarStatusAgendamento,
  reagendarAgendamento,
} from '../services/agendamento-service';

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    const agendamento = await criarAgendamento({
      clientName: String(req.body?.clientName ?? ''),
      phone: String(req.body?.phone ?? ''),
      email: String(req.body?.email ?? ''),
      serviceIds: Array.isArray(req.body?.serviceIds) ? req.body.serviceIds.map((s: unknown) => String(s)) : [],
      professionalId: String(req.body?.professionalId ?? ''),
      dateIso: String(req.body?.dateIso ?? ''),
      time: String(req.body?.time ?? ''),
    });
    res.status(201).json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao criar agendamento';
    res.status(status).json({ message });
  }
}

export async function listar(req: Request, res: Response): Promise<void> {
  try {
    const email = typeof req.query?.email === 'string' ? req.query.email : undefined;
    const data = typeof req.query?.data === 'string' ? req.query.data : undefined;
    const profissionalId =
      typeof req.query?.profissionalId === 'string' ? req.query.profissionalId : undefined;
    const lista = await listarAgendamentos({ email, data, profissionalId });
    res.json(lista);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : 'Erro ao listar agendamentos';
    res.status(status).json({ message });
  }
}

export async function buscarPorCode(req: Request, res: Response): Promise<void> {
  try {
    const agendamento = await buscarAgendamentoPorCode(String(req.params?.code ?? ''));
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 404;
    const message = error instanceof Error ? error.message : 'Agendamento não encontrado';
    res.status(status).json({ message });
  }
}

export async function cancelar(req: Request, res: Response): Promise<void> {
  try {
    const agendamento = await cancelarAgendamento(String(req.params?.code ?? ''));
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 404;
    const message = error instanceof Error ? error.message : 'Erro ao cancelar agendamento';
    res.status(status).json({ message });
  }
}

export async function atualizarStatus(req: Request, res: Response): Promise<void> {
  try {
    const agendamento = await atualizarStatusAgendamento(
      String(req.params?.code ?? ''),
      String(req.body?.status ?? '') as 'confirmado' | 'pendente' | 'concluido' | 'cancelado',
    );
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao atualizar status';
    res.status(status).json({ message });
  }
}

export async function reagendar(req: Request, res: Response): Promise<void> {
  try {
    const agendamento = await reagendarAgendamento(String(req.params?.code ?? ''), {
      professionalId: String(req.body?.professionalId ?? ''),
      dateIso: String(req.body?.dateIso ?? ''),
      time: String(req.body?.time ?? ''),
    });
    res.json(agendamento);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao reagendar';
    res.status(status).json({ message });
  }
}
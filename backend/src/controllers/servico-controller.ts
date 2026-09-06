import { Request, Response } from 'express';
import {
  obterServicos,
  criarServico,
  atualizarServico,
  excluirServico,
  substituirServicos,
} from '../services/servico-service';
import type { ServicoDTO } from '../repositories/servico-repository';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';

export async function listarServicos(req: Request, res: Response): Promise<void> {
  try {
    const apenasAtivos = req.query?.ativos === 'true';
    res.json(await obterServicos(apenasAtivos));
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : 'Erro ao buscar serviços';
    res.status(status).json({ message });
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    const dados = req.body as Omit<ServicoDTO, 'id'> | undefined;
    if (!dados?.name) throw new ValidationError('Nome é obrigatório');
    const criado = await criarServico({
      name: String(dados.name),
      description: String(dados.description ?? ''),
      category: String(dados.category ?? ''),
      durationMin: Number(dados.durationMin ?? 30),
      price: Number(dados.price ?? 0),
      icon: dados.icon ?? 'scissors',
      active: dados.active !== false,
    });
    res.status(201).json(criado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao criar serviço';
    res.status(status).json({ message });
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params?.id ?? '');
    const dados = req.body as Partial<Omit<ServicoDTO, 'id'>>;
    const atualizado = await atualizarServico(id, dados);
    if (!atualizado) throw new NotFoundError('Serviço não encontrado');
    res.json(atualizado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao atualizar serviço';
    res.status(status).json({ message });
  }
}

export async function excluir(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params?.id ?? '');
    const ok = await excluirServico(id);
    if (!ok) throw new NotFoundError('Serviço não encontrado');
    res.status(204).send();
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao excluir serviço';
    res.status(status).json({ message });
  }
}

export async function substituir(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body as Array<Partial<ServicoDTO> & { id?: string }>;
    if (!Array.isArray(payload)) throw new ValidationError('Corpo deve ser uma lista');
    const itens = payload.map((dados) => ({
      id: dados.id,
      name: String(dados.name ?? ''),
      description: String(dados.description ?? ''),
      category: String(dados.category ?? ''),
      durationMin: Number(dados.durationMin ?? 0),
      price: Number(dados.price ?? 0),
      icon: (dados.icon as ServicoDTO['icon']) ?? 'scissors',
      active: dados.active !== false,
    }));
    const resultado = await substituirServicos(itens);
    res.json(resultado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : 'Erro ao substituir serviços';
    res.status(status).json({ message });
  }
}
import { Request, Response } from 'express';
import {
  criarProfissional,
  excluirProfissional,
  obterProfissionais,
  atualizarProfissional,
  substituirProfissionais,
} from '../services/profissional-service';
import type { ProfissionalDTO } from '../repositories/profissional-repository';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';

export async function listar(req: Request, res: Response): Promise<void> {
  try {
    res.json(await obterProfissionais());
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao listar' });
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    const dados = req.body as Omit<ProfissionalDTO, 'id'> | undefined;
    if (!dados?.name) throw new ValidationError('Nome é obrigatório');
    const criado = await criarProfissional({
      name: String(dados.name),
      role: String(dados.role ?? 'professional'),
      category: String(dados.category ?? ''),
      active: dados.active !== false,
      photoUrl: dados.photoUrl,
    });
    res.status(201).json(criado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao criar' });
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params?.id ?? '');
    const dados = req.body as Partial<Omit<ProfissionalDTO, 'id'>>;
    const atualizado = await atualizarProfissional(id, dados);
    if (!atualizado) throw new NotFoundError('Profissional não encontrado');
    res.json(atualizado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao atualizar' });
  }
}

export async function excluir(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params?.id ?? '');
    const ok = await excluirProfissional(id);
    if (!ok) throw new NotFoundError('Profissional não encontrado');
    res.status(204).send();
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao excluir' });
  }
}

export async function substituir(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body as Array<Partial<ProfissionalDTO> & { id?: string }>;
    if (!Array.isArray(payload)) throw new ValidationError('Corpo deve ser uma lista');
    const itens = payload.map((d) => ({
      id: d.id,
      name: String(d.name ?? ''),
      role: String(d.role ?? 'professional'),
      category: String(d.category ?? ''),
      active: d.active !== false,
      photoUrl: d.photoUrl,
    }));
    res.json(await substituirProfissionais(itens));
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao substituir' });
  }
}
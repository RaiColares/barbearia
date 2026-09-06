import { Request, Response } from 'express';
import {
  obterUsuarios,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from '../services/usuario-service';
import type { UsuarioDTO } from '../repositories/usuario-repository';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';

export async function listar(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await obterUsuarios());
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro ao listar' });
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    const dados = req.body as Partial<Omit<UsuarioDTO, 'id'>> & { password?: string } | undefined;
    if (!dados?.email) throw new ValidationError('E-mail é obrigatório');
    const criado = await criarUsuario({
      nome: String(dados.nome ?? ''),
      email: String(dados.email),
      tipo: String(dados.tipo ?? 'cliente'),
      telefone: dados.telefone,
      professionalId: dados.professionalId,
      password: dados.password,
      ativo: dados.ativo !== false,
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
    const dados = req.body as Partial<Omit<UsuarioDTO, 'id'>> & { password?: string };
    const atualizado = await atualizarUsuario(id, dados);
    if (!atualizado) throw new NotFoundError('Usuário não encontrado');
    res.json(atualizado);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao atualizar' });
  }
}

export async function excluir(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params?.id ?? '');
    const ok = await excluirUsuario(id);
    if (!ok) throw new NotFoundError('Usuário não encontrado');
    res.status(204).send();
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    res.status(status).json({ message: error instanceof Error ? error.message : 'Erro ao excluir' });
  }
}
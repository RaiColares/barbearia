import {
  criarRepoProfissional,
  ProfissionalDTO,
} from '../repositories/profissional-repository';
import type { ProfissionalRepositoryInput } from '../repositories/profissional-repository';

export async function obterProfissionais(): Promise<ProfissionalDTO[]> {
  const repo = await criarRepoProfissional();
  return repo.listar();
}

export async function criarProfissional(dados: Omit<ProfissionalDTO, 'id'>): Promise<ProfissionalDTO> {
  const repo = await criarRepoProfissional();
  return repo.criar(dados);
}

export async function atualizarProfissional(
  id: string,
  dados: Partial<Omit<ProfissionalDTO, 'id'>>,
): Promise<ProfissionalDTO | null> {
  const repo = await criarRepoProfissional();
  return repo.atualizar(id, dados);
}

export async function excluirProfissional(id: string): Promise<boolean> {
  const repo = await criarRepoProfissional();
  return repo.excluir(id);
}

export async function substituirProfissionais(
  itens: ProfissionalRepositoryInput[],
): Promise<ProfissionalDTO[]> {
  const repo = await criarRepoProfissional();
  return repo.substituirTodos(itens);
}
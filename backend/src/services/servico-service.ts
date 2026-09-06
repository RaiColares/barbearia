import {
  criarRepoServico,
  ServicoDTO,
} from '../repositories/servico-repository';
import type { ServicoRepositoryInput } from '../repositories/servico-repository';

export async function obterServicos(apenasAtivos = false): Promise<ServicoDTO[]> {
  const repo = await criarRepoServico();
  return repo.listar(apenasAtivos);
}

export async function criarServico(dados: Omit<ServicoDTO, 'id'>): Promise<ServicoDTO> {
  const repo = await criarRepoServico();
  return repo.criar(dados);
}

export async function atualizarServico(
  id: string,
  dados: Partial<Omit<ServicoDTO, 'id'>>,
): Promise<ServicoDTO | null> {
  const repo = await criarRepoServico();
  return repo.atualizar(id, dados);
}

export async function excluirServico(id: string): Promise<boolean> {
  const repo = await criarRepoServico();
  return repo.excluir(id);
}

export async function substituirServicos(
  itens: ServicoRepositoryInput[],
): Promise<ServicoDTO[]> {
  const repo = await criarRepoServico();
  return repo.substituirTodos(itens);
}
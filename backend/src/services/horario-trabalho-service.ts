import {
  criarRepoHorarioTrabalho,
  HorarioTrabalhoDTO,
} from '../repositories/horario-trabalho-repository';

export async function obterHorariosPorProfissional(profissionalId: string): Promise<HorarioTrabalhoDTO[]> {
  const repo = await criarRepoHorarioTrabalho();
  return repo.listarPorProfissional(profissionalId);
}

export async function obterTodosHorarios(): Promise<HorarioTrabalhoDTO[]> {
  const repo = await criarRepoHorarioTrabalho();
  return repo.listarTodos();
}

export async function criarHorario(dados: Omit<HorarioTrabalhoDTO, 'id'>): Promise<HorarioTrabalhoDTO> {
  const repo = await criarRepoHorarioTrabalho();
  return repo.criar(dados);
}

export async function substituirHorarios(
  profissionalId: string,
  horarios: Omit<HorarioTrabalhoDTO, 'id' | 'profissionalId'>[],
): Promise<HorarioTrabalhoDTO[]> {
  const repo = await criarRepoHorarioTrabalho();
  await repo.excluirPorProfissional(profissionalId);
  const created: HorarioTrabalhoDTO[] = [];
  for (const h of horarios) {
    created.push(await repo.criar({ ...h, profissionalId }));
  }
  return created;
}
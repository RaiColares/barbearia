import {
  criarRepoUsuario,
  UsuarioDTO,
} from '../repositories/usuario-repository';
import { criarRepoProfissional } from '../repositories/profissional-repository';
import { gerarSenhaHash } from './auth-service';
import type { InsertInput } from '../database/repository';

export interface CriarUsuarioInput extends Omit<UsuarioDTO, 'id'> {
  password?: string;
}

const CARGO_POR_TIPO: Record<string, string> = {
  admin: 'administrador',
  administrador: 'administrador',
  recepcao: 'recepcionista',
  recepcionista: 'recepcionista',
  superuser: 'superusuario',
  superusuario: 'superusuario',
  barbeiro: 'barbeiro',
  profissional: 'barbeiro',
};

export async function obterUsuarios(): Promise<UsuarioDTO[]> {
  const repo = await criarRepoUsuario();
  return repo.listarDTOs();
}

export async function criarUsuario(dados: CriarUsuarioInput): Promise<UsuarioDTO> {
  const repo = await criarRepoUsuario();
  const tipoBackend = dados.tipo === 'profissional' ? 'funcionario' : dados.tipo;
  const updates: InsertInput = {
    email: dados.email.trim().toLowerCase(),
    tipo: tipoBackend || 'cliente',
    nome: dados.nome?.trim() || null,
    telefone: dados.telefone ?? null,
    senha_hash: dados.password ? await gerarSenhaHash(dados.password) : null,
  };
  const id = await repo.criar(updates);
  if (dados.professionalId) {
    await atualizarVinculoFuncionario(dados.professionalId, id);
  } else {
    const cargo = CARGO_POR_TIPO[tipoBackend ?? ''];
    if (cargo) {
      const repoProfissional = await criarRepoProfissional();
      const nome = dados.nome?.trim() || String(dados.email).split('@')[0] || 'Usuário';
      const criado = await repoProfissional.criar({
        name: nome,
        role: cargo,
        category: '',
        active: true,
      });
      await repoProfissional.vincularUsuario(criado.id, id);
    }
  }
  const dto = (await repo.listarDTOs()).find(u => u.id === id) ?? null;
  if (!dto) throw new Error('Falha ao criar usuário');
  return dto;
}

async function atualizarVinculoFuncionario(funcionarioId: string, usuarioId: string): Promise<void> {
  const repo = await criarRepoProfissional();
  await repo.vincularUsuario(funcionarioId, usuarioId);
}

export async function atualizarUsuario(
  id: string,
  dados: Partial<Omit<UsuarioDTO, 'id'>> & { password?: string },
): Promise<UsuarioDTO | null> {
  const repo = await criarRepoUsuario();
  const updates: InsertInput = {};
  if (dados.email !== undefined) updates.email = dados.email.trim().toLowerCase();
  if (dados.tipo !== undefined) updates.tipo = dados.tipo;
  if (dados.password !== undefined) updates.senha_hash = await gerarSenhaHash(dados.password);
  const ok = await repo.atualizar(id, updates);
  if (!ok) return null;
  const row = await repo.buscarPorId(id);
  if (!row) return null;
  const dto = (await repo.listarDTOs()).find(u => u.id === id);
  return dto ?? null;
}

export async function excluirUsuario(id: string): Promise<boolean> {
  const repo = await criarRepoUsuario();
  return repo.excluir(id);
}

export async function buscarUsuarioPorEmail(email: string): Promise<UsuarioDTO | null> {
  const repo = await criarRepoUsuario();
  const row = await repo.buscarPorEmail(email);
  if (!row) return null;
  const dto = (await repo.listarDTOs()).find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  return dto ?? null;
}
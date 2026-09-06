import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { ValidationError } from '../errors/ValidationError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import {
  findUsuarioByEmail,
  findUsuarioByGoogleId,
  criarUsuarioGoogle,
  vincularGoogleAUsuario,
  criarCliente,
  obterClienteNome,
  obterFuncionarioNome,
  type UsuarioRow,
} from '../repositories/auth-repository';
import { criarRepoUsuario } from '../repositories/usuario-repository';
import type { LoginResponseDTO, UsuarioDTO } from '../dtos/auth-dto';
import { signAuthToken, AppRole } from '../utils/jwt';

const DEFAULT_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

const client = new OAuth2Client(DEFAULT_CLIENT_ID);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SENHA_REGEX = /^(?=.*[A-ZÀ-Ü])(?=.*[^A-Za-z0-9À-ÿ\s]).{8,}$/;

export interface GoogleProfile {
  sub: string;
  email: string;
  nome: string;
  avatarUrl: string | null;
}

export function validarTokenGoogle(idToken: string): Promise<GoogleProfile> {
  if (!idToken) {
    throw new ValidationError('Token do Google ausente');
  }
  return client
    .verifyIdToken({
      idToken,
      audience: DEFAULT_CLIENT_ID,
    })
    .then((ticket) => {
      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        throw new ForbiddenError('Token do Google inválido');
      }
      return {
        sub: payload.sub,
        email: payload.email,
        nome: payload.name || payload.email,
        avatarUrl: payload.picture || null,
      };
    })
    .catch((error: unknown) => {
      if (error instanceof ValidationError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new ForbiddenError('Falha ao validar token do Google');
    });
}

export function mapearCargoParaRole(cargo: string | null | undefined, tipo: string | null | undefined): AppRole {
  if (tipo === 'cliente') return 'cliente';
  if (cargo === 'superusuario') return 'superusuario';
  if (cargo === 'administrador') return 'admin';
  if (cargo === 'recepcionista') return 'recepcionista';
  return 'profissional';
}

function buildUsuarioDTO(usuario: UsuarioRow, nome: string | null, cargo?: string | null): UsuarioDTO {
  return {
    id: usuario.id,
    email: usuario.email,
    tipo: usuario.tipo,
    nome,
    cargo: cargo || null,
    avatarUrl: usuario.avatar_url,
  };
}

function gerarToken(usuario: UsuarioRow, nome: string | null, cargo: string | null | undefined): string {
  const role = mapearCargoParaRole(cargo, usuario.tipo);
  return signAuthToken({
    sub: usuario.id,
    email: usuario.email,
    role,
    nome,
    cargo: cargo || null,
    tipo: usuario.tipo,
  });
}

export async function autenticarComGoogle(idToken: string): Promise<LoginResponseDTO> {
  const perfil = await validarTokenGoogle(idToken);

  let usuario = await findUsuarioByGoogleId(perfil.sub);

  if (!usuario) {
    usuario = await findUsuarioByEmail(perfil.email);

    if (usuario) {
      await vincularGoogleAUsuario(usuario.id, perfil.sub, perfil.avatarUrl);
    } else {
      usuario = await criarUsuarioGoogle({
        email: perfil.email,
        googleId: perfil.sub,
        nome: perfil.nome,
        avatarUrl: perfil.avatarUrl,
      });
      await criarCliente({ usuarioId: usuario.id, nome: perfil.nome });
    }
  }

  const { nome, cargo } = await obterNomeECargo(usuario);

  return {
    token: gerarToken(usuario, nome, cargo),
    user: buildUsuarioDTO(usuario, nome, cargo),
  };
}

async function obterNomeECargo(usuario: UsuarioRow): Promise<{ nome: string | null; cargo: string | null }> {
  if (usuario.tipo === 'cliente') {
    const nome = await obterClienteNome(usuario.id);
    return { nome, cargo: null };
  }
  const funcionario = await obterFuncionarioNome(usuario.id);
  return { nome: funcionario?.nome ?? null, cargo: funcionario?.cargo ?? null };
}

export async function autenticarComSenha(email: string, senha: string): Promise<LoginResponseDTO> {
  if (!email || !senha) {
    throw new ValidationError('E-mail e senha obrigatórios');
  }

  const usuario = await findUsuarioByEmail(email);
  if (!usuario || !usuario.senha_hash) {
    throw new NotFoundError('Credenciais inválidas');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    throw new ForbiddenError('Credenciais inválidas');
  }

  const { nome, cargo } = await obterNomeECargo(usuario);

  return {
    token: gerarToken(usuario, nome, cargo),
    user: buildUsuarioDTO(usuario, nome, cargo),
  };
}

export function gerarSenhaHash(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10);
}

export async function registrarCliente(data: {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
}): Promise<LoginResponseDTO> {
  const nome = data.nome.trim();
  if (nome.length < 3 || !nome.includes(' ')) {
    throw new ValidationError('Informe seu nome completo');
  }

  const email = data.email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Informe um e-mail válido');
  }

  if (!SENHA_REGEX.test(data.senha)) {
    throw new ValidationError(
      'A senha deve ter 8+ caracteres, com letra maiúscula e caracter especial',
    );
  }

  let telefone: string | undefined;
  if (data.telefone !== undefined && data.telefone.trim() !== '') {
    telefone = data.telefone.replace(/\D/g, '');
    if (telefone.length < 10) {
      throw new ValidationError('Informe um telefone válido com DDD');
    }
  }

  if (await findUsuarioByEmail(email)) {
    throw new ValidationError('Já existe uma conta com este e-mail');
  }

  const senhaHash = await gerarSenhaHash(data.senha);
  const usuarioRepo = await criarRepoUsuario();
  const usuarioId = await usuarioRepo.criarUsuarioComSenha({
    nome,
    email,
    telefone,
    senhaHash,
  });
  await criarCliente({ usuarioId, nome });

  const usuario: UsuarioRow = {
    id: usuarioId,
    email,
    senha_hash: senhaHash,
    tipo: 'cliente',
    google_id: null,
    avatar_url: null,
  };
  const { nome: nomeFinal, cargo } = await obterNomeECargo(usuario);

  return {
    token: gerarToken(usuario, nomeFinal, cargo),
    user: buildUsuarioDTO(usuario, nomeFinal, cargo),
  };
}

export function gerarTokenInterno(): string {
  return 'tok_' + crypto.randomBytes(24).toString('hex');
}
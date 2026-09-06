import type { Request, Response } from 'express';
import {
  autenticarComGoogle,
  autenticarComSenha,
} from '../services/auth-service';
import { mapearCargoParaRole } from '../services/auth-service';

const SESSION_TTL_MS = 30 * 60 * 1000;

export async function loginComSenha(req: Request, res: Response): Promise<void> {
  const email = typeof req.body?.email === 'string' ? req.body.email : undefined;
  const senha =
    typeof req.body?.password === 'string'
      ? req.body.password
      : typeof req.body?.senha === 'string'
        ? req.body.senha
        : undefined;

  if (!email || !senha) {
    res.status(400).json({ message: 'Email e senha obrigatorios' });
    return;
  }

  try {
    const resultado = await autenticarComSenha(email.trim().toLowerCase(), senha);
    res.json({
      token: resultado.token,
      userName: resultado.user.nome,
      userEmail: resultado.user.email,
      expiresAt: Date.now() + SESSION_TTL_MS,
      role: mapearCargoParaRole(resultado.user.cargo, resultado.user.tipo),
    });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 401;
    const message =
      error instanceof Error ? error.message : 'Falha ao autenticar';
    res.status(status).json({ message });
  }
}

export async function loginComGoogle(req: Request, res: Response): Promise<void> {
  const { idToken } = req.body;

  if (!idToken || typeof idToken !== 'string') {
    res.status(400).json({ message: 'Token do Google não fornecido' });
    return;
  }

  try {
    const resultado = await autenticarComGoogle(idToken);
    res.json({
      token: resultado.token,
      userName: resultado.user.nome,
      userEmail: resultado.user.email,
      expiresAt: Date.now() + SESSION_TTL_MS,
      role: mapearCargoParaRole(resultado.user.cargo, resultado.user.tipo),
      avatarUrl: resultado.user.avatarUrl,
    });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 401;
    const message =
      error instanceof Error ? error.message : 'Falha ao autenticar com Google';
    res.status(status).json({ message });
  }
}
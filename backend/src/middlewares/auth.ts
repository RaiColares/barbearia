import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, JwtPayload } from '../utils/jwt';
import { ForbiddenError } from '../errors/ForbiddenError';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new ForbiddenError('Autenticação necessária'));
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyAuthToken(token);
    (req as AuthRequest).user = payload;
    next();
  } catch {
    next(new ForbiddenError('Sessão inválida ou expirada'));
  }
}

export function requireRole(allowed: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    if (!user) {
      next(new ForbiddenError('Autenticação necessária'));
      return;
    }
    if (!allowed.includes(user.role)) {
      next(new ForbiddenError('Acesso restrito ao papel apropriado'));
      return;
    }
    next();
  };
}
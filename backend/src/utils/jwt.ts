import jwt from 'jsonwebtoken';

export type AppRole = 'superusuario' | 'admin' | 'recepcionista' | 'profissional' | 'cliente';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AppRole;
  nome: string | null;
  cargo: string | null;
  tipo: string | null;
}

const DEFAULT_SECRET = 'maraca-demo-secret-nao-utilizar-em-producao';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

export function signAuthToken(payload: JwtPayload, expiresIn: string | number = '12h'): string {
  return jwt.sign({ ...payload }, getJwtSecret(), {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAuthToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}
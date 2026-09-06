import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Autenticação necessária') {
    super(message, 401);
  }
}
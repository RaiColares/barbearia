import { Router } from 'express';
import {
  loginComGoogle,
  loginComSenha,
  registrar,
} from '../controllers/auth-controller';

const authRoutes = Router();

authRoutes.post('/register', registrar);
authRoutes.post('/login', loginComSenha);
authRoutes.post('/google', loginComGoogle);

export default authRoutes;
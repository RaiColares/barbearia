import { Router } from 'express';
import { loginComGoogle, loginComSenha } from '../controllers/auth-controller';

const authRoutes = Router();

authRoutes.post('/login', loginComSenha);
authRoutes.post('/google', loginComGoogle);

export default authRoutes;
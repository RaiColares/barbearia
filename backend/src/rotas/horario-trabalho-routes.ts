import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  listarPorProfissional,
  substituir,
} from '../controllers/horario-trabalho-controller';

const horarioTrabalhoRoutes = Router();

horarioTrabalhoRoutes.get('/profissional/:profissionalId', requireAuth, listarPorProfissional);
horarioTrabalhoRoutes.put('/profissional/:profissionalId', requireAuth, substituir);

export default horarioTrabalhoRoutes;
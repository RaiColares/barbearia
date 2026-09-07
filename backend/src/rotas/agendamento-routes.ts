import { Router } from 'express';
import {
  criar,
  listar,
  buscarPorCode,
  cancelar,
  atualizarStatus,
  reagendar,
} from '../controllers/agendamento-controller';
import { requireAuth } from '../middlewares/auth';

const agendamentoRoutes = Router();

agendamentoRoutes.post('/', criar);
agendamentoRoutes.get('/', requireAuth, listar);
agendamentoRoutes.get('/:code', requireAuth, buscarPorCode);
agendamentoRoutes.patch('/:code', requireAuth, atualizarStatus);
agendamentoRoutes.patch('/:code/cancelar', requireAuth, cancelar);
agendamentoRoutes.patch('/:code/reagendar', requireAuth, reagendar);

export default agendamentoRoutes;
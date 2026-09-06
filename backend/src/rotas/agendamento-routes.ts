import { Router } from 'express';
import {
  criar,
  listar,
  buscarPorCode,
  cancelar,
  atualizarStatus,
  reagendar,
} from '../controllers/agendamento-controller';

const agendamentoRoutes = Router();

agendamentoRoutes.get('/', listar);
agendamentoRoutes.post('/', criar);
agendamentoRoutes.get('/:code', buscarPorCode);
agendamentoRoutes.patch('/:code', atualizarStatus);
agendamentoRoutes.patch('/:code/cancelar', cancelar);
agendamentoRoutes.patch('/:code/reagendar', reagendar);

export default agendamentoRoutes;
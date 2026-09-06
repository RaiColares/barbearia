import { Router } from 'express';
import {
  listarServicos,
  criar,
  atualizar,
  excluir,
  substituir,
} from '../controllers/servico-controller';
import { requireAuth, requireRole } from '../middlewares/auth';

const servicoRoutes = Router();

servicoRoutes.get('/', listarServicos);
servicoRoutes.post('/', requireAuth, requireRole(['admin', 'superusuario']), criar);
servicoRoutes.put('/', requireAuth, requireRole(['admin', 'superusuario']), substituir);
servicoRoutes.patch('/:id', requireAuth, requireRole(['admin', 'superusuario']), atualizar);
servicoRoutes.delete('/:id', requireAuth, requireRole(['admin', 'superusuario']), excluir);

export default servicoRoutes;
import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { listar, criar, atualizar, excluir, substituir } from '../controllers/profissional-controller';

const profissionalRoutes = Router();

profissionalRoutes.get('/', listar);
profissionalRoutes.post('/', requireAuth, requireRole(['admin', 'superusuario']), criar);
profissionalRoutes.put('/', requireAuth, requireRole(['admin', 'superusuario']), substituir);
profissionalRoutes.patch('/:id', requireAuth, requireRole(['admin', 'superusuario']), atualizar);
profissionalRoutes.delete('/:id', requireAuth, requireRole(['admin', 'superusuario']), excluir);

export default profissionalRoutes;
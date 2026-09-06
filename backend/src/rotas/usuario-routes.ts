import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import {
  listar,
  criar,
  atualizar,
  excluir,
} from '../controllers/usuario-controller';

const usuarioRoutes = Router();

usuarioRoutes.get('/', requireAuth, requireRole(['admin', 'superusuario']), listar);
usuarioRoutes.post('/', requireAuth, requireRole(['admin', 'superusuario']), criar);
usuarioRoutes.patch('/:id', requireAuth, requireRole(['admin', 'superusuario']), atualizar);
usuarioRoutes.delete('/:id', requireAuth, requireRole(['admin', 'superusuario']), excluir);

export default usuarioRoutes;
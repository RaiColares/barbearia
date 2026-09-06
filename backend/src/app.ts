import express from 'express';
import cors from 'cors';
import getDb from './database/connection';
import servicoRoutes from './rotas/servico-routes';
import authRoutes from './rotas/auth-routes';
import agendamentoRoutes from './rotas/agendamento-routes';
import profissionalRoutes from './rotas/profissional-routes';
import usuarioRoutes from './rotas/usuario-routes';
import horarioTrabalhoRoutes from './rotas/horario-trabalho-routes';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const db = getDb();
    const ok = await db.isHealthy();
    res.json({ status: 'ok', database: ok ? 'connected' : 'disconnected' });
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/horarios-trabalho', horarioTrabalhoRoutes);
app.use('/api/agendamentos', agendamentoRoutes);

app.use('/api/{*path}', (_req, _res, next) => {
  next(new NotFoundError('Rota não encontrada'));
});

app.use(errorHandler);

export default app;
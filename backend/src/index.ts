import dotenv from 'dotenv';
import path from 'path';
import app from './app';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
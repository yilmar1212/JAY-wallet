import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { probarConexion } from './db/db.js';
import pruebaRoutes from './routes/pruebaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import deudorRoutes from './routes/deudorRoutes.js'; // <-- NUEVO

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'jay-wallet-api' });
});

app.use('/api/prueba', pruebaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deudores', deudorRoutes); // <-- NUEVO

app.listen(PORT, async () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  await probarConexion();
});
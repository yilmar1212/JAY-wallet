import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { probarConexion } from './db/db.js'; // Importamos la función

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'jay-wallet-api' });
});

app.listen(PORT, async () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  // Ejecutamos la prueba de conexión al arrancar
  await probarConexion();
});
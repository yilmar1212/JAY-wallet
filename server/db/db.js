import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Extraemos Pool del paquete pg
const { Pool } = pg;

// Creamos la conexión usando la URL de Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido por Neon para conexiones seguras
  }
});

// Función rápida para probar la conexión
export const probarConexion = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a Neon:', res.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Error conectando a Neon:', error.message);
  }
};

export default pool;
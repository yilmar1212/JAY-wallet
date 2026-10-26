import pool from '../db/db.js';

export const probarBaseDeDatos = async (req, res) => {
  try {
    // Hacemos una consulta simple para ver si la tabla 'usuarios' existe
    const resultado = await pool.query('SELECT COUNT(*) FROM usuarios');
    const cantidad = resultado.rows[0].count;
    
    res.json({
      ok: true,
      mensaje: '¡El backend está leyendo la base de datos!',
      usuariosRegistrados: cantidad
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar la base de datos',
      error: error.message
    });
  }
};
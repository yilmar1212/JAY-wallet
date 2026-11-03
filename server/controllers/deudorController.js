import pool from '../db/db.js';

// Crear un nuevo deudor
export const crearDeudor = async (req, res) => {
  try {
    // req.usuario.id viene del token (lo puso nuestro middleware)
    const usuarioId = req.usuario.id; 
    const { nombre, documento, telefono, direccion, correo, notas } = req.body;

    if (!nombre) {
      return res.status(400).json({ ok: false, mensaje: 'El nombre es obligatorio' });
    }

    const nuevoDeudor = await pool.query(
      `INSERT INTO deudores 
      (usuario_id, nombre, documento, telefono, direccion, correo, notas) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [usuarioId, nombre, documento, telefono, direccion, correo, notas]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Deudor creado exitosamente',
      deudor: nuevoDeudor.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al crear el deudor' });
  }
};

// Obtener todos los deudores del usuario logueado
export const obtenerDeudores = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    // Solo traemos los deudores que pertenecen a este usuario
    const resultado = await pool.query(
      'SELECT * FROM deudores WHERE usuario_id = $1 ORDER BY creado_en DESC', 
      [usuarioId]
    );

    res.json({
      ok: true,
      deudores: resultado.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener los deudores' });
  }
};
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/db.js';

// --- 1. FUNCIÓN DE REGISTRO ---
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
    }
    const usuarioExiste = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ ok: false, mensaje: 'El correo ya está registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena_hash) VALUES ($1, $2, $3) RETURNING id, nombre, correo',
      [nombre, correo, contrasenaHash]
    );
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor al registrar usuario' });
  }
};

// --- 2. FUNCIÓN DE LOGIN ---
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Correo y contraseña son obligatorios' });
    }
    const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (resultado.rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos' });
    }
    const usuario = resultado.rows[0];
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida) {
      return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos' });
    }
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({
      ok: true,
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor al iniciar sesión' });
  }
};
import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js'; // <-- Agregamos loginUsuario

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario); // <-- NUEVA RUTA

export default router;
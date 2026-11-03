import { Router } from 'express';
import { probarBaseDeDatos } from '../controllers/pruebaController.js';
import { verificarToken } from '../middleware/authMiddleware.js'; // <-- NUEVO

const router = Router();

// Le decimos: "Antes de ejecutar probarBaseDeDatos, ejecuta verificarToken"
router.get('/', verificarToken, probarBaseDeDatos); 

export default router;
import { Router } from 'express';
import { probarBaseDeDatos } from '../controllers/pruebaController.js';

const router = Router();

// Definimos la ruta GET /api/prueba
router.get('/', probarBaseDeDatos);

export default router;
import { Router } from 'express';
import { crearDeudor, obtenerDeudores } from '../controllers/deudorController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Aplicamos el middleware a TODAS las rutas de este archivo
router.use(verificarToken);

router.post('/', crearDeudor);
router.get('/', obtenerDeudores);

export default router;
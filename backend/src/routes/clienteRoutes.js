// src/routes/clienteRoutes.js - Rotas de Clientes
import { Router } from 'express';
import clienteController from '../controllers/clienteController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// Rotas de busca (devem vir antes das rotas com parâmetros)
router.get('/buscar', clienteController.buscar);
router.get('/estatisticas', clienteController.estatisticas);

// CRUD
router.get('/', clienteController.listar);
router.get('/:cpf', clienteController.obter);
router.post('/', clienteController.registrar);

export default router;

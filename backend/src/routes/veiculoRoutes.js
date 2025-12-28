// src/routes/veiculoRoutes.js - Rotas de Veículos
import { Router } from 'express';
import veiculoController from '../controllers/veiculoController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// Rotas especiais (devem vir antes das rotas com parâmetros)
router.get('/buscar', veiculoController.buscar);
router.get('/estatisticas', veiculoController.estatisticas);

// CRUD
router.get('/', veiculoController.listar);
router.post('/', veiculoController.adicionar);
router.get('/:id', veiculoController.obter);
router.put('/:id', veiculoController.atualizar);
router.delete('/:id', veiculoController.excluir);

export default router;

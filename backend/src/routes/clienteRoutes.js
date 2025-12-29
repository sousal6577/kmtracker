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

// Rota por ID (deve vir antes da rota :cpf para não conflitar)
router.get('/id/:clienteId', clienteController.obterPorId);

// CRUD
router.get('/', clienteController.listar);
router.get('/:cpf', clienteController.obter);
router.post('/', clienteController.registrar);
router.put('/:clienteId', clienteController.atualizar);
router.patch('/:clienteId/status', clienteController.alternarStatus);
router.delete('/:clienteId', clienteController.excluir);

// Veículos do cliente
router.get('/:clienteId/veiculos', clienteController.listarVeiculos);

export default router;

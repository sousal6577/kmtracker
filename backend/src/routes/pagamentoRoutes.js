// src/routes/pagamentoRoutes.js - Rotas de Pagamentos
import { Router } from 'express';
import pagamentoController from '../controllers/pagamentoController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// Rotas de ações
router.post('/confirmar', pagamentoController.confirmar);
router.post('/pendente', pagamentoController.marcarPendente);
router.post('/novo-mes', pagamentoController.iniciarNovoMes);

// Rotas de consulta
router.get('/', pagamentoController.listar);
router.get('/atrasados', pagamentoController.listarAtrasados);
router.get('/resumo', pagamentoController.obterResumo);
router.get('/dashboard', pagamentoController.dashboard);
router.get('/historico/:clienteId', pagamentoController.obterHistorico);

export default router;

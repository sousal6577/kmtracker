// src/routes/index.js - Agregador de Rotas
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import veiculoRoutes from './veiculoRoutes.js';
import pagamentoRoutes from './pagamentoRoutes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'KMTracker API v2 está funcionando!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Registra todas as rotas
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/veiculos', veiculoRoutes);
router.use('/pagamentos', pagamentoRoutes);

export default router;

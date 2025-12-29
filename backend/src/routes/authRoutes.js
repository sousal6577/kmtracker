// src/routes/authRoutes.js - Rotas de Autenticação
import { Router } from 'express';
import authController from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rotas públicas
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword); // Troca de senha (primeiro acesso)

// Rotas protegidas
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/register', requireAuth, authController.register);
router.get('/users', requireAuth, authController.listUsers);
router.put('/users/:id', requireAuth, authController.updateUser);
router.delete('/users/:id', requireAuth, authController.deleteUser);

export default router;

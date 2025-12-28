// src/controllers/authController.js - Controller de Autenticação
import authService from '../services/authServiceV2.js';

class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { username, password, usuario, senha } = req.body;
      const user = username || usuario;
      const pass = password || senha;

      if (!user || !pass) {
        return res.status(400).json({ 
          success: false, 
          message: 'Usuário e senha são obrigatórios' 
        });
      }

      const result = await authService.login(user, pass);

      // Configurar cookie com o token
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      res.clearCookie('token');
      res.json({ success: true, message: 'Logout realizado com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao fazer logout' });
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req, res) {
    try {
      // req.user é definido pelo middleware de autenticação
      res.json({ 
        success: true, 
        user: req.user 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao obter usuário' });
    }
  }

  /**
   * POST /api/auth/register (admin only)
   */
  async register(req, res) {
    try {
      const { usuario, senha, role } = req.body;

      if (!usuario || !senha) {
        return res.status(400).json({ 
          success: false, 
          message: 'Usuário e senha são obrigatórios' 
        });
      }

      const result = await authService.createUser(usuario, senha, role);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { userId, senhaAtual, novaSenha } = req.body;
      const userIdFinal = userId || req.user?.id;

      if (!userIdFinal || !novaSenha) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID do usuário e nova senha são obrigatórios' 
        });
      }

      const result = await authService.trocarSenha(userIdFinal, senhaAtual, novaSenha);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/auth/users (admin only)
   */
  async listUsers(req, res) {
    try {
      const users = await authService.listUsers();
      res.json({ success: true, users });
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

export default new AuthController();

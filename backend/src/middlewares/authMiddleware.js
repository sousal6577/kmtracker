// src/middlewares/authMiddleware.js - Middleware de Autenticação
import authService from '../services/authService.js';

/**
 * Middleware para verificar autenticação via JWT
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Busca token no header Authorization ou no cookie
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    // Verifica e decodifica o token
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Adiciona dados do usuário ao request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(401).json({
      success: false,
      message: 'Falha na autenticação'
    });
  }
};

/**
 * Middleware opcional - não bloqueia se não tiver token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = authService.verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Continua mesmo com erro
    next();
  }
};

/**
 * Middleware para verificar permissões específicas
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permissão '${permission}' necessária`
      });
    }

    next();
  };
};

export default { requireAuth, optionalAuth, requirePermission };

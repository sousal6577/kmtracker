// src/middlewares/errorHandler.js - Middleware de Tratamento de Erros

/**
 * Classe para erros personalizados da API
 */
export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Middleware de tratamento de erros global
 */
export const errorHandler = (err, req, res, next) => {
  console.error('=== ERRO NA API ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Rota:', req.method, req.originalUrl);
  console.error('Erro:', err.message);
  if (err.stack) {
    console.error('Stack:', err.stack);
  }
  console.error('==================');

  // Se for ApiError, usa o status definido
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      details: err.details
    });
  }

  // Erros de validação do JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido no corpo da requisição'
    });
  }

  // Erros de sintaxe
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: 'Erro de sintaxe na requisição'
    });
  }

  // Erro genérico
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

/**
 * Middleware para rotas não encontradas
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Wrapper para async handlers - captura erros automaticamente
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default { ApiError, errorHandler, notFoundHandler, asyncHandler };

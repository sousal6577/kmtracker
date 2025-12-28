// server.js - Entry Point da API KMTracker V2
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3080;

// ======================
// MIDDLEWARES GLOBAIS
// ======================

// CORS configurado para desenvolvimento e produção (incluindo Codespace)
app.use(cors({
  origin: function(origin, callback) {
    // Permite requests sem origin (mobile, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Permite qualquer origem do Codespace ou Railway
    if (origin.includes('.app.github.dev') || 
        origin.includes('.github.dev') ||
        origin.includes('railway.app') ||
        origin.includes('codespaces') ||
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(null, true); // Permite todas em desenvolvimento
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON e cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Log de requisições (desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ======================
// ROTAS
// ======================

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'KMTracker API',
    version: '2.0.0',
    description: 'API para gestão de rastreamento de veículos',
    docs: '/api/health'
  });
});

// API Routes
app.use('/api', routes);

// ======================
// TRATAMENTO DE ERROS
// ======================

// Rota não encontrada
app.use(notFoundHandler);

// Handler global de erros
app.use(errorHandler);

// ======================
// INICIALIZAÇÃO
// ======================

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       🚗 KMTRACKER API V2 🚗           ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Servidor rodando na porta: ${PORT}        ║`);
  console.log(`║  Ambiente: ${(process.env.NODE_ENV || 'development').padEnd(23)}║`);
  console.log('╠════════════════════════════════════════╣');
  console.log('║  Endpoints:                            ║');
  console.log(`║  → http://localhost:${PORT}/api/health     ║`);
  console.log(`║  → http://localhost:${PORT}/api/auth       ║`);
  console.log(`║  → http://localhost:${PORT}/api/clientes   ║`);
  console.log(`║  → http://localhost:${PORT}/api/veiculos   ║`);
  console.log(`║  → http://localhost:${PORT}/api/pagamentos ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});

export default app;

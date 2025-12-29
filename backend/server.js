// server.js - Entry Point da API KMTracker V2
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';
import cronService from './src/services/cronService.js';

// Carrega variáveis de ambiente
dotenv.config();

// ES Module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

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
      'https://www.kmtraker.com.br',
      'https://kmtraker.com.br',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Permite qualquer origem do Codespace, Railway ou domínio próprio
    if (origin.includes('.app.github.dev') || 
        origin.includes('.github.dev') ||
        origin.includes('railway.app') ||
        origin.includes('codespaces') ||
        origin.includes('kmtraker.com.br') ||
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

// API Routes
app.use('/api', routes);

// ======================
// ARQUIVOS ESTÁTICOS (Frontend em produção)
// ======================

// Serve arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  
  // Serve arquivos estáticos
  app.use(express.static(publicPath));
  
  // Para qualquer rota que não seja /api, serve o index.html (SPA)
  app.get('*', (req, res, next) => {
    // Se for uma rota da API, passa para o próximo handler
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  // Em desenvolvimento, a rota raiz retorna info da API
  app.get('/', (req, res) => {
    res.json({
      name: 'KMTracker API',
      version: '2.0.0',
      description: 'API para gestão de rastreamento de veículos',
      docs: '/api/health'
    });
  });
}

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
  
  // Inicia o serviço de tarefas agendadas (cron)
  cronService.start();
});

export default app;

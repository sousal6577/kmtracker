// src/main.jsx - Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Eruda - Console de Debug para Mobile (tipo F12)
// Ativa automaticamente em desenvolvimento ou com ?eruda na URL
if (import.meta.env.DEV || window.location.search.includes('eruda')) {
  import('eruda').then((eruda) => {
    eruda.default.init();
    console.log('🔧 Eruda Debug Console ativado!');
  });
}

// Registra Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
        
        // Verifica por atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Nova versão do Service Worker disponível');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão pronta, pode recarregar
              console.log('🆕 Nova versão instalada! Recarregue para atualizar.');
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

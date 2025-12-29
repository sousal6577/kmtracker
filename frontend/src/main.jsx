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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

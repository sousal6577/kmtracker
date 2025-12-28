// src/api/axios.js - Instância configurada do Axios
import axios from 'axios';

// Detecta URL da API automaticamente
const getApiBaseUrl = () => {
  // Se houver variável de ambiente definida, usa ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // No Codespace, detecta automaticamente
  if (window.location.hostname.includes('.app.github.dev')) {
    // Troca a porta 5173 por 3005 na URL do Codespace
    return window.location.origin.replace('-5173.', '-3005.').replace('-5174.', '-3005.') + '/api';
  }
  
  // Local development - usa proxy
  return '/api';
};

// Cria instância do axios com configurações base
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Importante para cookies
});

// Interceptor de Request - adiciona token se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Token expirado ou inválido
    if (response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redireciona para login se não estiver lá
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Erro de permissão
    if (response?.status === 403) {
      console.error('Acesso negado:', response.data?.message);
    }

    return Promise.reject(error);
  }
);

export default api;

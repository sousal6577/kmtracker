// src/api/authApi.js - API de Autenticação
import api from './axios';

const authApi = {
  /**
   * Faz login do usuário
   */
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Verifica se é primeiro acesso
      if (response.data.primeiroAcesso) {
        localStorage.setItem('primeiroAcesso', 'true');
      } else {
        localStorage.removeItem('primeiroAcesso');
      }
    }
    
    return response.data;
  },

  /**
   * Troca de senha
   */
  changePassword: async (userId, senhaAtual, novaSenha) => {
    const response = await api.post('/auth/change-password', { 
      userId, 
      senhaAtual, 
      novaSenha 
    });
    
    if (response.data.success) {
      localStorage.removeItem('primeiroAcesso');
    }
    
    return response.data;
  },

  /**
   * Faz logout do usuário
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('primeiroAcesso');
    }
  },

  /**
   * Obtém dados do usuário atual
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Registra novo usuário (somente admin)
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Lista todos os usuários
   */
  listUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  /**
   * Atualiza um usuário existente
   */
  updateUser: async (id, dados) => {
    const response = await api.put(`/auth/users/${id}`, dados);
    return response.data;
  },

  /**
   * Exclui um usuário
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },

  /**
   * Verifica se está autenticado (local)
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Verifica se é primeiro acesso
   */
  isPrimeiroAcesso: () => {
    return localStorage.getItem('primeiroAcesso') === 'true';
  },

  /**
   * Obtém usuário do localStorage
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authApi;

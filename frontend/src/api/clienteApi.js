// src/api/clienteApi.js - API de Clientes
import api from './axios';

const clienteApi = {
  /**
   * Lista todos os clientes
   */
  listar: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  /**
   * Obtém um cliente específico por CPF
   */
  obter: async (cpf) => {
    const response = await api.get(`/clientes/${cpf}`);
    return response.data;
  },

  /**
   * Registra novo cliente
   */
  registrar: async (dados) => {
    const response = await api.post('/clientes', dados);
    return response.data;
  },

  /**
   * Busca clientes por termo
   */
  buscar: async (termo) => {
    const response = await api.get('/clientes/buscar', { params: { termo } });
    return response.data;
  },

  /**
   * Obtém estatísticas dos clientes
   */
  estatisticas: async () => {
    const response = await api.get('/clientes/estatisticas');
    return response.data;
  }
};

export default clienteApi;

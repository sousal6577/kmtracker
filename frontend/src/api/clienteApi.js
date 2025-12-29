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
   * Obtém um cliente por ID
   */
  obterPorId: async (clienteId) => {
    const response = await api.get(`/clientes/id/${clienteId}`);
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
   * Atualiza dados do cliente
   */
  atualizar: async (clienteId, dados) => {
    const response = await api.put(`/clientes/${clienteId}`, dados);
    return response.data;
  },

  /**
   * Alterna status do cliente (ativo/inativo)
   */
  alternarStatus: async (clienteId) => {
    const response = await api.patch(`/clientes/${clienteId}/status`);
    return response.data;
  },

  /**
   * Exclui um cliente
   */
  excluir: async (clienteId) => {
    const response = await api.delete(`/clientes/${clienteId}`);
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
   * Lista veículos de um cliente
   */
  listarVeiculos: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/veiculos`);
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

// src/api/veiculoApi.js - API de Veículos
import api from './axios';

const veiculoApi = {
  /**
   * Lista todos os veículos
   */
  listar: async () => {
    const response = await api.get('/veiculos');
    return response.data;
  },

  /**
   * Lista veículos de um cliente específico
   */
  listarPorCliente: async (clienteId) => {
    const response = await api.get('/veiculos', { params: { clienteId } });
    return response.data;
  },

  /**
   * Obtém um veículo específico
   */
  obter: async (id) => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
  },

  /**
   * Adiciona novo veículo
   */
  adicionar: async (dados) => {
    const response = await api.post('/veiculos', dados);
    return response.data;
  },

  /**
   * Atualiza veículo existente
   */
  atualizar: async (id, dados) => {
    const response = await api.put(`/veiculos/${id}`, dados);
    return response.data;
  },

  /**
   * Exclui um veículo
   */
  excluir: async (id) => {
    const response = await api.delete(`/veiculos/${id}`);
    return response.data;
  },

  /**
   * Busca veículo por placa
   */
  buscarPorPlaca: async (placa) => {
    const response = await api.get('/veiculos/buscar', { params: { placa } });
    return response.data;
  },

  /**
   * Obtém estatísticas dos veículos
   */
  estatisticas: async () => {
    const response = await api.get('/veiculos/estatisticas');
    return response.data;
  }
};

export default veiculoApi;

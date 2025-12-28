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
   * Obtém um veículo específico
   */
  obter: async (cpf, veiculoId) => {
    const response = await api.get(`/veiculos/${cpf}/${veiculoId}`);
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
  atualizar: async (cpf, veiculoId, dados) => {
    const response = await api.put(`/veiculos/${cpf}/${veiculoId}`, dados);
    return response.data;
  },

  /**
   * Exclui um veículo
   */
  excluir: async (cpf, veiculoId) => {
    const response = await api.delete(`/veiculos/${cpf}/${veiculoId}`);
    return response.data;
  },

  /**
   * Busca veículo por placa
   */
  buscarPorPlaca: async (placa) => {
    const response = await api.get('/veiculos/buscar', { params: { placa } });
    return response.data;
  }
};

export default veiculoApi;

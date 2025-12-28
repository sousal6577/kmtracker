// src/api/pagamentoApi.js - API de Pagamentos
import api from './axios';

const pagamentoApi = {
  /**
   * Lista todos os pagamentos
   */
  listar: async () => {
    const response = await api.get('/pagamentos');
    return response.data;
  },

  /**
   * Confirma pagamento de um veículo
   */
  confirmar: async (cpf, veiculoId) => {
    const response = await api.post('/pagamentos/confirmar', { cpf, veiculoId });
    return response.data;
  },

  /**
   * Marca veículo como pendente
   */
  marcarPendente: async (cpf, veiculoId) => {
    const response = await api.post('/pagamentos/pendente', { cpf, veiculoId });
    return response.data;
  },

  /**
   * Lista todos os veículos com pagamento atrasado
   */
  listarAtrasados: async () => {
    const response = await api.get('/pagamentos/atrasados');
    return response.data;
  },

  /**
   * Inicia novo mês (reseta status para pendente)
   */
  iniciarNovoMes: async () => {
    const response = await api.post('/pagamentos/novo-mes');
    return response.data;
  },

  /**
   * Obtém histórico de pagamentos de um cliente
   */
  obterHistorico: async (cpf) => {
    const response = await api.get(`/pagamentos/historico/${cpf}`);
    return response.data;
  },

  /**
   * Obtém resumo do mês
   */
  obterResumo: async (mes, ano) => {
    const response = await api.get('/pagamentos/resumo', { params: { mes, ano } });
    return response.data;
  }
};

export default pagamentoApi;

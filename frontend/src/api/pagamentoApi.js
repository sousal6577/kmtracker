// src/api/pagamentoApi.js - API de Pagamentos
import api from './axios';

const pagamentoApi = {
  /**
   * Lista pagamentos do mês atual ou específico
   */
  listar: async (mes = null, ano = null) => {
    const params = {};
    if (mes) params.mes = mes;
    if (ano) params.ano = ano;
    const response = await api.get('/pagamentos', { params });
    return response.data;
  },

  /**
   * Confirma pagamento
   */
  confirmar: async (pagamentoId, dados = {}) => {
    const response = await api.post('/pagamentos/confirmar', { 
      pagamentoId,
      ...dados 
    });
    return response.data;
  },

  /**
   * Marca pagamento como pendente
   */
  marcarPendente: async (pagamentoId) => {
    const response = await api.post('/pagamentos/pendente', { pagamentoId });
    return response.data;
  },

  /**
   * Lista pagamentos atrasados
   */
  listarAtrasados: async () => {
    const response = await api.get('/pagamentos/atrasados');
    return response.data;
  },

  /**
   * Inicia novo mês
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
   * Obtém resumo/dashboard
   */
  obterResumo: async (mes, ano) => {
    const response = await api.get('/pagamentos/resumo', { params: { mes, ano } });
    return response.data;
  },

  /**
   * Dashboard geral
   */
  dashboard: async () => {
    const response = await api.get('/pagamentos/dashboard');
    return response.data;
  }
};

export default pagamentoApi;

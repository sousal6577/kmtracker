// src/hooks/usePagamentos.js - Hook para gerenciar pagamentos
import { useState, useCallback } from 'react';
import { pagamentoApi } from '../api';
import toast from 'react-hot-toast';

export function usePagamentos() {
  const [atrasados, setAtrasados] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Confirma pagamento
  const confirmarPagamento = useCallback(async (cpf, veiculoId) => {
    try {
      const response = await pagamentoApi.confirmar(cpf, veiculoId);
      if (response.success) {
        toast.success('Pagamento confirmado!');
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao confirmar pagamento');
      throw err;
    }
  }, []);

  // Marca como pendente
  const marcarPendente = useCallback(async (cpf, veiculoId) => {
    try {
      const response = await pagamentoApi.marcarPendente(cpf, veiculoId);
      if (response.success) {
        toast.success('Marcado como pendente');
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao marcar pendente');
      throw err;
    }
  }, []);

  // Carrega atrasados
  const carregarAtrasados = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pagamentoApi.listarAtrasados();
      if (response.success) {
        setAtrasados(response.atrasados || []);
      }
    } catch (err) {
      toast.error('Erro ao carregar atrasados');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega resumo do mês
  const carregarResumo = useCallback(async (mes, ano) => {
    setLoading(true);
    try {
      const response = await pagamentoApi.obterResumo(mes, ano);
      if (response.success) {
        setResumo(response.resumo);
      }
    } catch (err) {
      toast.error('Erro ao carregar resumo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicia novo mês
  const iniciarNovoMes = useCallback(async () => {
    if (!confirm('Iniciar novo mês? Todos os status serão resetados para PENDENTE.')) {
      return;
    }
    
    try {
      const response = await pagamentoApi.iniciarNovoMes();
      if (response.success) {
        toast.success('Novo mês iniciado!');
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao iniciar novo mês');
      throw err;
    }
  }, []);

  return {
    atrasados,
    resumo,
    loading,
    confirmarPagamento,
    marcarPendente,
    carregarAtrasados,
    carregarResumo,
    iniciarNovoMes
  };
}

export default usePagamentos;

// src/hooks/usePagamentos.js - Hook para gerenciar pagamentos
import { useState, useCallback, useEffect } from 'react';
import { pagamentoApi } from '../api';
import toast from 'react-hot-toast';

export function usePagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [atrasados, setAtrasados] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const agora = new Date();
    return { mes: agora.getMonth() + 1, ano: agora.getFullYear() };
  });

  // Carrega pagamentos do mês
  const carregarPagamentos = useCallback(async (mes = null, ano = null) => {
    setLoading(true);
    try {
      const m = mes !== null ? mes : mesSelecionado.mes;
      const a = ano !== null ? ano : mesSelecionado.ano;
      
      // Se mês for 0, significa "todos" - não passa mês/ano
      let response;
      if (m === 0) {
        response = await pagamentoApi.listarTodos(a);
      } else {
        response = await pagamentoApi.listar(m, a);
      }
      
      if (response.success) {
        setPagamentos(response.pagamentos || []);
      }
    } catch (err) {
      toast.error('Erro ao carregar pagamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mesSelecionado]);

  // Muda mês selecionado
  const mudarMes = useCallback((mes, ano) => {
    setMesSelecionado({ mes, ano });
  }, []);

  // Confirma pagamento
  const confirmarPagamento = useCallback(async (pagamentoId, dados = {}) => {
    try {
      const response = await pagamentoApi.confirmar(pagamentoId, dados);
      if (response.success) {
        toast.success('Pagamento confirmado!');
        await carregarPagamentos();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao confirmar pagamento');
      throw err;
    }
  }, [carregarPagamentos]);

  // Marca como pendente
  const marcarPendente = useCallback(async (pagamentoId) => {
    try {
      const response = await pagamentoApi.marcarPendente(pagamentoId);
      if (response.success) {
        toast.success('Marcado como pendente');
        await carregarPagamentos();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao marcar pendente');
      throw err;
    }
  }, [carregarPagamentos]);

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
    if (!confirm('Iniciar novo mês? Pagamentos pendentes serão criados para todos os veículos ativos.')) {
      return;
    }
    
    try {
      const response = await pagamentoApi.iniciarNovoMes();
      if (response.success) {
        toast.success('Novo mês iniciado!');
        await carregarPagamentos();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao iniciar novo mês');
      throw err;
    }
  }, [carregarPagamentos]);

  // Carrega pagamentos ao mudar mês
  useEffect(() => {
    carregarPagamentos();
  }, [mesSelecionado, carregarPagamentos]);

  return {
    pagamentos,
    atrasados,
    resumo,
    loading,
    mesSelecionado,
    mudarMes,
    carregarPagamentos,
    confirmarPagamento,
    marcarPendente,
    carregarAtrasados,
    carregarResumo,
    iniciarNovoMes
  };
}

export default usePagamentos;

// src/hooks/useVeiculos.js - Hook para gerenciar veículos
import { useState, useEffect, useCallback } from 'react';
import { veiculoApi } from '../api';
import toast from 'react-hot-toast';

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega lista de veículos
  const carregarVeiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await veiculoApi.listar();
      if (response.success) {
        setVeiculos(response.veiculos || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar veículos');
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Adiciona veículo
  const adicionarVeiculo = useCallback(async (dados) => {
    try {
      const response = await veiculoApi.adicionar(dados);
      if (response.success) {
        toast.success('Veículo adicionado com sucesso!');
        await carregarVeiculos();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao adicionar veículo');
      throw err;
    }
  }, [carregarVeiculos]);

  // Atualiza veículo
  const atualizarVeiculo = useCallback(async (cpf, veiculoId, dados) => {
    try {
      const response = await veiculoApi.atualizar(cpf, veiculoId, dados);
      if (response.success) {
        toast.success('Veículo atualizado!');
        await carregarVeiculos();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar');
      throw err;
    }
  }, [carregarVeiculos]);

  // Exclui veículo
  const excluirVeiculo = useCallback(async (cpf, veiculoId) => {
    try {
      const response = await veiculoApi.excluir(cpf, veiculoId);
      if (response.success) {
        toast.success('Veículo excluído!');
        await carregarVeiculos();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao excluir');
      throw err;
    }
  }, [carregarVeiculos]);

  // Carrega ao montar
  useEffect(() => {
    carregarVeiculos();
  }, [carregarVeiculos]);

  return {
    veiculos,
    loading,
    error,
    carregarVeiculos,
    adicionarVeiculo,
    atualizarVeiculo,
    excluirVeiculo
  };
}

export default useVeiculos;

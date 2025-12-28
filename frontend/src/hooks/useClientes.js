// src/hooks/useClientes.js - Hook para gerenciar clientes
import { useState, useEffect, useCallback } from 'react';
import { clienteApi } from '../api';
import toast from 'react-hot-toast';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega lista de clientes
  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clienteApi.listar();
      if (response.success) {
        setClientes(response.clientes || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca clientes por termo
  const buscarClientes = useCallback(async (termo) => {
    if (!termo || termo.length < 2) {
      return carregarClientes();
    }
    
    setLoading(true);
    try {
      const response = await clienteApi.buscar(termo);
      if (response.success) {
        setClientes(response.clientes || []);
      }
    } catch (err) {
      toast.error('Erro na busca');
    } finally {
      setLoading(false);
    }
  }, [carregarClientes]);

  // Registra novo cliente
  const registrarCliente = useCallback(async (dados) => {
    try {
      const response = await clienteApi.registrar(dados);
      if (response.success) {
        toast.success('Cliente registrado com sucesso!');
        await carregarClientes();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao registrar cliente');
      throw err;
    }
  }, [carregarClientes]);

  // Adiciona novo cliente (alias para registrarCliente)
  const adicionarCliente = useCallback(async (dados) => {
    try {
      const response = await clienteApi.registrar(dados);
      if (response.success) {
        toast.success('Cliente cadastrado com sucesso!');
        await carregarClientes();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao cadastrar cliente');
      throw err;
    }
  }, [carregarClientes]);

  // Atualiza cliente existente
  const atualizarCliente = useCallback(async (clienteId, dados) => {
    try {
      const response = await clienteApi.atualizar(clienteId, dados);
      if (response.success) {
        toast.success('Cliente atualizado com sucesso!');
        await carregarClientes();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar cliente');
      throw err;
    }
  }, [carregarClientes]);

  // Remove cliente
  const removerCliente = useCallback(async (clienteId) => {
    try {
      const response = await clienteApi.excluir(clienteId);
      if (response.success) {
        toast.success('Cliente excluído com sucesso!');
        await carregarClientes();
      }
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao excluir cliente');
      throw err;
    }
  }, [carregarClientes]);

  // Carrega ao montar
  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  return {
    clientes,
    loading,
    error,
    carregarClientes,
    buscarClientes,
    registrarCliente,
    adicionarCliente,
    atualizarCliente,
    removerCliente,
  };
}

export default useClientes;

// src/services/veiculoServiceV2.js - Service de Veículos (Firestore)
import { collections, FieldValue, firestore } from '../config/firestore.js';

class VeiculoServiceV2 {
  constructor() {
    this.collection = collections.veiculos;
  }

  /**
   * Lista todos os veículos com filtros e paginação
   * Exclui veículos com statusVeiculo = 'cancelado' (excluídos)
   */
  async listar({ 
    limite = 100, 
    ultimoId = null, 
    situacao = null,
    clienteCpf = null,
    ordenarPor = 'placa',
    direcao = 'asc',
    incluirCancelados = false
  } = {}) {
    try {
      // Busca todos e filtra em memória para evitar problemas de índice composto
      const snapshot = await this.collection.get();
      
      let veiculos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filtra veículos cancelados/excluídos (soft delete)
      if (!incluirCancelados) {
        veiculos = veiculos.filter(v => v.statusVeiculo !== 'cancelado');
      }
      
      // Filtra por situação (PAGO, PENDENTE, ATRASADO)
      if (situacao) {
        veiculos = veiculos.filter(v => v.situacao?.toUpperCase() === situacao.toUpperCase());
      }
      
      // Filtra por CPF do cliente
      if (clienteCpf) {
        const cpfNormalizado = clienteCpf.replace(/\D/g, '');
        veiculos = veiculos.filter(v => v.clienteCpf === cpfNormalizado);
      }
      
      // Ordena
      veiculos.sort((a, b) => {
        const valorA = (a[ordenarPor] || '').toString().toLowerCase();
        const valorB = (b[ordenarPor] || '').toString().toLowerCase();
        return direcao === 'asc' 
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      });

      // Aplica limite
      if (limite) {
        veiculos = veiculos.slice(0, limite);
      }

      return {
        success: true,
        veiculos,
        total: veiculos.length,
        ultimoId: veiculos.length > 0 ? veiculos[veiculos.length - 1].id : null,
        temMais: veiculos.length === limite
      };
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      throw { status: 500, message: 'Erro ao listar veículos' };
    }
  }

  /**
   * Obtém veículo por ID
   */
  async obterPorId(id) {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Veículo não encontrado' };
      }

      return {
        success: true,
        veiculo: { id: doc.id, ...doc.data() }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao obter veículo:', error);
      throw { status: 500, message: 'Erro ao obter veículo' };
    }
  }

  /**
   * Busca veículo por placa
   */
  async obterPorPlaca(placa) {
    try {
      const placaNormalizada = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const snapshot = await this.collection.where('placa', '==', placaNormalizada).limit(1).get();
      
      if (snapshot.empty) {
        throw { status: 404, message: 'Veículo não encontrado' };
      }

      const doc = snapshot.docs[0];
      return {
        success: true,
        veiculo: { id: doc.id, ...doc.data() }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao buscar por placa:', error);
      throw { status: 500, message: 'Erro ao buscar veículo' };
    }
  }

  /**
   * Lista veículos de um cliente (aceita ID ou CPF)
   */
  async listarPorCliente(clienteIdOrCpf) {
    try {
      let snapshot;
      
      // Tenta primeiro por clienteId (se parecer ser um ID do Firestore)
      if (clienteIdOrCpf.length > 15 && !clienteIdOrCpf.includes('.')) {
        snapshot = await this.collection
          .where('clienteId', '==', clienteIdOrCpf)
          .get();
        
        // Se não encontrou por ID, tenta por CPF
        if (snapshot.empty) {
          const cpfNormalizado = clienteIdOrCpf.replace(/\D/g, '');
          snapshot = await this.collection
            .where('clienteCpf', '==', cpfNormalizado)
            .get();
        }
      } else {
        // Busca por CPF
        const cpfNormalizado = clienteIdOrCpf.replace(/\D/g, '');
        snapshot = await this.collection
          .where('clienteCpf', '==', cpfNormalizado)
          .get();
      }

      // Filtra veículos cancelados e ordena por placa
      const veiculos = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(v => v.statusVeiculo !== 'cancelado')
        .sort((a, b) => (a.placa || '').localeCompare(b.placa || ''));

      return {
        success: true,
        veiculos,
        total: veiculos.length
      };
    } catch (error) {
      console.error('Erro ao listar veículos do cliente:', error);
      throw { status: 500, message: 'Erro ao listar veículos' };
    }
  }

  /**
   * Busca veículos por termo
   */
  async buscar(termo) {
    try {
      const termoUpper = termo.toUpperCase();
      
      // Busca por placa
      const porPlaca = await this.collection
        .where('placa', '>=', termoUpper)
        .where('placa', '<=', termoUpper + '\uf8ff')
        .limit(20)
        .get();
      
      // Busca por modelo
      const porModelo = await this.collection
        .where('modelo', '>=', termoUpper)
        .where('modelo', '<=', termoUpper + '\uf8ff')
        .limit(20)
        .get();

      // Combina resultados únicos
      const veiculosMap = new Map();
      
      porPlaca.docs.forEach(doc => {
        veiculosMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      porModelo.docs.forEach(doc => {
        if (!veiculosMap.has(doc.id)) {
          veiculosMap.set(doc.id, { id: doc.id, ...doc.data() });
        }
      });

      return {
        success: true,
        veiculos: Array.from(veiculosMap.values()),
        total: veiculosMap.size
      };
    } catch (error) {
      console.error('Erro na busca:', error);
      throw { status: 500, message: 'Erro na busca de veículos' };
    }
  }

  /**
   * Cria novo veículo
   */
  async criar(dados, usuario = null) {
    try {
      const { 
        clienteCpf, clienteNome, placa, modelo, tipoVeiculo,
        imei, numeroSim, equipamento, dataInstalacao,
        valor, diaVencimento, tipoAquisicao, obs
      } = dados;
      
      if (!clienteCpf || !placa) {
        throw { status: 400, message: 'CPF do cliente e placa são obrigatórios' };
      }

      const placaNormalizada = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const cpfNormalizado = clienteCpf.replace(/\D/g, '');
      
      // Verifica se placa já existe
      const existente = await this.collection.where('placa', '==', placaNormalizada).limit(1).get();
      if (!existente.empty) {
        throw { status: 409, message: 'Placa já cadastrada' };
      }

      // Busca cliente para referência
      const clienteSnap = await collections.clientes.where('cpf', '==', cpfNormalizado).limit(1).get();
      const clienteId = clienteSnap.empty ? null : clienteSnap.docs[0].id;
      const nomeCliente = clienteSnap.empty ? clienteNome : clienteSnap.docs[0].data().nome;

      const novoVeiculo = {
        clienteId,
        clienteCpf: cpfNormalizado,
        clienteNome: nomeCliente?.toUpperCase() || '',
        
        placa: placaNormalizada,
        modelo: modelo?.toUpperCase().trim() || '',
        tipoVeiculo: tipoVeiculo?.trim() || '',
        
        imei: imei?.trim() || '',
        numeroSim: numeroSim?.trim() || '',
        equipamento: equipamento?.trim() || '',
        dataInstalacao: dataInstalacao ? new Date(dataInstalacao) : null,
        
        valor: parseFloat(valor) || 0,
        diaVencimento: parseInt(diaVencimento) || 10,
        tipoAquisicao: tipoAquisicao?.trim() || '',
        
        situacao: 'PENDENTE',
        statusVeiculo: 'ativo',
        obs: obs?.trim() || '',
        
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: usuario || 'sistema'
      };

      // Transação para criar veículo e atualizar contador do cliente
      const docRef = await firestore.runTransaction(async (transaction) => {
        const ref = this.collection.doc();
        transaction.set(ref, novoVeiculo);
        
        // Incrementa contador do cliente
        if (clienteId) {
          const clienteRef = collections.clientes.doc(clienteId);
          transaction.update(clienteRef, {
            totalVeiculos: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp()
          });
        }
        
        return ref;
      });

      // Cria pagamento do mês atual
      await this.criarPagamentoMesAtual(docRef.id, novoVeiculo);

      return {
        success: true,
        message: 'Veículo criado com sucesso',
        veiculo: { id: docRef.id, ...novoVeiculo }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao criar veículo:', error);
      throw { status: 500, message: 'Erro ao criar veículo' };
    }
  }

  /**
   * Atualiza veículo
   */
  async atualizar(id, dados, usuario = null) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Veículo não encontrado' };
      }

      // Campos permitidos para atualização
      const camposPermitidos = [
        'modelo', 'tipoVeiculo', 'imei', 'numeroSim', 'equipamento',
        'dataInstalacao', 'valor', 'diaVencimento', 'tipoAquisicao',
        'statusVeiculo', 'obs'
      ];
      
      const atualizacao = { 
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: usuario || 'sistema'
      };
      
      for (const campo of camposPermitidos) {
        if (dados[campo] !== undefined) {
          if (campo === 'modelo') {
            atualizacao[campo] = dados[campo].toUpperCase().trim();
          } else if (campo === 'valor') {
            atualizacao[campo] = parseFloat(dados[campo]) || 0;
          } else if (campo === 'diaVencimento') {
            atualizacao[campo] = parseInt(dados[campo]) || 10;
          } else if (campo === 'dataInstalacao' && dados[campo]) {
            atualizacao[campo] = new Date(dados[campo]);
          } else {
            atualizacao[campo] = dados[campo];
          }
        }
      }

      await docRef.update(atualizacao);

      return {
        success: true,
        message: 'Veículo atualizado com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao atualizar veículo:', error);
      throw { status: 500, message: 'Erro ao atualizar veículo' };
    }
  }

  /**
   * Exclui veículo (soft delete)
   */
  async excluir(id, usuario = null) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Veículo não encontrado' };
      }

      const veiculoData = doc.data();

      // Soft delete - marca como cancelado
      await firestore.runTransaction(async (transaction) => {
        transaction.update(docRef, {
          statusVeiculo: 'cancelado',
          updatedAt: FieldValue.serverTimestamp(),
          deletedAt: FieldValue.serverTimestamp(),
          deletedBy: usuario || 'sistema'
        });
        
        // Decrementa contador do cliente
        if (veiculoData.clienteId) {
          const clienteRef = collections.clientes.doc(veiculoData.clienteId);
          transaction.update(clienteRef, {
            totalVeiculos: FieldValue.increment(-1),
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      });

      return {
        success: true,
        message: 'Veículo excluído com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao excluir veículo:', error);
      throw { status: 500, message: 'Erro ao excluir veículo' };
    }
  }

  /**
   * Cria pagamento do mês atual para um veículo
   */
  async criarPagamentoMesAtual(veiculoId, veiculoData) {
    const agora = new Date();
    const mes = agora.getMonth() + 1;
    const ano = agora.getFullYear();
    const mesAno = `${ano}-${String(mes).padStart(2, '0')}`;

    const pagamento = {
      veiculoId,
      clienteId: veiculoData.clienteId,
      clienteCpf: veiculoData.clienteCpf,
      clienteNome: veiculoData.clienteNome,
      placa: veiculoData.placa,
      
      ano,
      mes,
      mesAno,
      
      valor: veiculoData.valor,
      valorPago: 0,
      
      status: 'PENDENTE',
      dataPagamento: null,
      formaPagamento: null,
      
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    await collections.pagamentos.add(pagamento);
  }

  /**
   * Estatísticas de veículos
   */
  async obterEstatisticas() {
    try {
      const [total, ativos, pendentes, pagos] = await Promise.all([
        this.collection.count().get(),
        this.collection.where('statusVeiculo', '==', 'ativo').count().get(),
        this.collection.where('situacao', '==', 'PENDENTE').count().get(),
        this.collection.where('situacao', '==', 'PAGO').count().get()
      ]);

      return {
        success: true,
        estatisticas: {
          total: total.data().count,
          ativos: ativos.data().count,
          pendentes: pendentes.data().count,
          pagos: pagos.data().count
        }
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw { status: 500, message: 'Erro ao obter estatísticas' };
    }
  }
}

export default new VeiculoServiceV2();

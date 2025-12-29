// src/services/clienteServiceV2.js - Service de Clientes (Firestore)
import { collections, FieldValue } from '../config/firestore.js';

class ClienteServiceV2 {
  constructor() {
    this.collection = collections.clientes;
  }

  /**
   * Lista todos os clientes com paginação
   */
  async listar({ limite = 50, ultimoId = null, ordenarPor = 'nome', direcao = 'asc' } = {}) {
    try {
      let query = this.collection.orderBy(ordenarPor, direcao);
      
      if (ultimoId) {
        const ultimoDoc = await this.collection.doc(ultimoId).get();
        if (ultimoDoc.exists) {
          query = query.startAfter(ultimoDoc);
        }
      }
      
      query = query.limit(limite);
      const snapshot = await query.get();
      
      const clientes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        clientes,
        total: clientes.length,
        ultimoId: clientes.length > 0 ? clientes[clientes.length - 1].id : null,
        temMais: clientes.length === limite
      };
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw { status: 500, message: 'Erro ao listar clientes' };
    }
  }

  /**
   * Busca cliente por ID
   */
  async obterPorId(id) {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Cliente não encontrado' };
      }

      return {
        success: true,
        cliente: { id: doc.id, ...doc.data() }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao obter cliente:', error);
      throw { status: 500, message: 'Erro ao obter cliente' };
    }
  }

  /**
   * Busca cliente por CPF
   */
  async obterPorCpf(cpf) {
    try {
      const cpfNormalizado = cpf.replace(/\D/g, '');
      const snapshot = await this.collection.where('cpf', '==', cpfNormalizado).limit(1).get();
      
      if (snapshot.empty) {
        throw { status: 404, message: 'Cliente não encontrado' };
      }

      const doc = snapshot.docs[0];
      return {
        success: true,
        cliente: { id: doc.id, ...doc.data() }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao buscar por CPF:', error);
      throw { status: 500, message: 'Erro ao buscar cliente' };
    }
  }

  /**
   * Busca clientes por termo (nome, CPF, telefone)
   */
  async buscar(termo) {
    try {
      const termoLower = termo.toLowerCase();
      const termoUpper = termo.toUpperCase();
      
      // Busca por nome (startsWith)
      const porNome = await this.collection
        .where('nome', '>=', termoUpper)
        .where('nome', '<=', termoUpper + '\uf8ff')
        .limit(20)
        .get();
      
      // Busca por CPF
      const cpfNormalizado = termo.replace(/\D/g, '');
      let porCpf = { docs: [] };
      if (cpfNormalizado.length >= 3) {
        porCpf = await this.collection
          .where('cpf', '>=', cpfNormalizado)
          .where('cpf', '<=', cpfNormalizado + '\uf8ff')
          .limit(10)
          .get();
      }

      // Combina resultados únicos
      const clientesMap = new Map();
      
      porNome.docs.forEach(doc => {
        clientesMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      porCpf.docs.forEach(doc => {
        if (!clientesMap.has(doc.id)) {
          clientesMap.set(doc.id, { id: doc.id, ...doc.data() });
        }
      });

      return {
        success: true,
        clientes: Array.from(clientesMap.values()),
        total: clientesMap.size
      };
    } catch (error) {
      console.error('Erro na busca:', error);
      throw { status: 500, message: 'Erro na busca de clientes' };
    }
  }

  /**
   * Cria novo cliente
   */
  async criar(dados) {
    try {
      const { cpf, nome, email, telefone, cidade } = dados;
      
      if (!cpf || !nome) {
        throw { status: 400, message: 'CPF e nome são obrigatórios' };
      }

      const cpfNormalizado = cpf.replace(/\D/g, '');
      
      // Verifica se CPF já existe
      const existente = await this.collection.where('cpf', '==', cpfNormalizado).limit(1).get();
      if (!existente.empty) {
        throw { status: 409, message: 'CPF já cadastrado' };
      }

      const novoCliente = {
        cpf: cpfNormalizado,
        nome: nome.toUpperCase().trim(),
        email: email?.toLowerCase().trim() || '',
        telefone: telefone?.trim() || '',
        cidade: cidade?.trim() || '',
        status: 'ativo',
        totalVeiculos: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const docRef = await this.collection.add(novoCliente);

      return {
        success: true,
        message: 'Cliente criado com sucesso',
        cliente: { id: docRef.id, ...novoCliente }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao criar cliente:', error);
      throw { status: 500, message: 'Erro ao criar cliente' };
    }
  }

  /**
   * Atualiza cliente
   */
  async atualizar(id, dados) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Cliente não encontrado' };
      }

      // Campos permitidos para atualização
      const camposPermitidos = ['nome', 'email', 'telefone', 'cidade', 'status'];
      const atualizacao = { updatedAt: FieldValue.serverTimestamp() };
      
      for (const campo of camposPermitidos) {
        if (dados[campo] !== undefined) {
          atualizacao[campo] = campo === 'nome' ? dados[campo].toUpperCase().trim() :
                              campo === 'email' ? dados[campo].toLowerCase().trim() :
                              dados[campo];
        }
      }

      await docRef.update(atualizacao);

      return {
        success: true,
        message: 'Cliente atualizado com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao atualizar cliente:', error);
      throw { status: 500, message: 'Erro ao atualizar cliente' };
    }
  }

  /**
   * Alterna status do cliente (ativo/inativo)
   */
  async alternarStatus(id) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Cliente não encontrado' };
      }

      const statusAtual = doc.data().status || 'ativo';
      const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo';

      await docRef.update({
        status: novoStatus,
        updatedAt: FieldValue.serverTimestamp()
      });

      return {
        success: true,
        message: `Cliente ${novoStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso`,
        novoStatus
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao alternar status:', error);
      throw { status: 500, message: 'Erro ao alternar status do cliente' };
    }
  }

  /**
   * Exclui cliente (verifica veículos ativos primeiro)
   */
  async excluir(id) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Cliente não encontrado' };
      }

      // Verifica se há veículos ATIVOS (não cancelados) associados
      const veiculosSnap = await collections.veiculos.where('clienteId', '==', id).get();
      const veiculosAtivos = veiculosSnap.docs.filter(d => d.data().statusVeiculo !== 'cancelado');
      
      if (veiculosAtivos.length > 0) {
        throw { status: 400, message: `Não é possível excluir cliente com ${veiculosAtivos.length} veículo(s) ativo(s). Remova os veículos primeiro.` };
      }

      await docRef.delete();

      return {
        success: true,
        message: 'Cliente excluído com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao excluir cliente:', error);
      throw { status: 500, message: 'Erro ao excluir cliente' };
    }
  }

  /**
   * Lista veículos de um cliente
   */
  async listarVeiculos(clienteId) {
    try {
      const clienteDoc = await this.collection.doc(clienteId).get();
      if (!clienteDoc.exists) {
        throw { status: 404, message: 'Cliente não encontrado' };
      }

      const veiculosSnap = await collections.veiculos
        .where('clienteId', '==', clienteId)
        .get();

      const veiculos = veiculosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calcula valor total
      const valorTotal = veiculos.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);

      return {
        success: true,
        veiculos,
        total: veiculos.length,
        valorTotal,
        cliente: { id: clienteDoc.id, ...clienteDoc.data() }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao listar veículos do cliente:', error);
      throw { status: 500, message: 'Erro ao listar veículos do cliente' };
    }
  }

  /**
   * Obtém estatísticas dos clientes
   */
  async obterEstatisticas() {
    try {
      const mesAno = this.getMesAnoAtual();
      
      const [clientesSnap, veiculosSnap, pagamentosSnap] = await Promise.all([
        this.collection.get(),
        collections.veiculos.get(),
        collections.pagamentos.where('mesAno', '==', mesAno).get()
      ]);

      let totalValor = 0;
      let totalPago = 0;
      let pendentes = 0;
      let pagos = 0;
      let atrasados = 0;

      // Se não houver pagamentos do mês, calcula baseado nos veículos ativos
      if (pagamentosSnap.empty) {
        const veiculosAtivos = veiculosSnap.docs.filter(d => d.data().statusVeiculo === 'ativo');
        totalValor = veiculosAtivos.reduce((acc, d) => acc + (d.data().valor || 0), 0);
        pendentes = veiculosAtivos.length;
        
        console.log(`[Estatísticas] Nenhum pagamento para ${mesAno}. Veículos ativos: ${veiculosAtivos.length}`);
      } else {
        pagamentosSnap.docs.forEach(doc => {
          const d = doc.data();
          totalValor += d.valor || 0;
          totalPago += d.valorPago || 0;
          
          if (d.status === 'PAGO') pagos++;
          else if (d.status === 'ATRASADO') atrasados++;
          else pendentes++;
        });
      }

      return {
        success: true,
        estatisticas: {
          totalClientes: clientesSnap.size,
          totalVeiculos: veiculosSnap.size,
          mesAtual: {
            mesAno,
            totalPagamentos: pagamentosSnap.size,
            totalValor,
            totalPago,
            pendentes,
            pagos,
            atrasados,
            percentualRecebido: totalValor > 0 ? ((totalPago / totalValor) * 100).toFixed(1) : 0
          }
        }
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw { status: 500, message: 'Erro ao obter estatísticas' };
    }
  }

  getMesAnoAtual() {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
  }
}

export default new ClienteServiceV2();

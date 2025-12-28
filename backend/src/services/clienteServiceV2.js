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
   * Obtém estatísticas dos clientes
   */
  async obterEstatisticas() {
    try {
      const [clientesSnap, veiculosSnap, pagamentosSnap] = await Promise.all([
        this.collection.get(),
        collections.veiculos.get(),
        collections.pagamentos.where('mesAno', '==', this.getMesAnoAtual()).get()
      ]);

      let totalValor = 0;
      let totalPago = 0;
      let pendentes = 0;
      let pagos = 0;
      let atrasados = 0;

      pagamentosSnap.docs.forEach(doc => {
        const d = doc.data();
        totalValor += d.valor || 0;
        totalPago += d.valorPago || 0;
        
        if (d.status === 'PAGO') pagos++;
        else if (d.status === 'ATRASADO') atrasados++;
        else pendentes++;
      });

      return {
        success: true,
        estatisticas: {
          totalClientes: clientesSnap.size,
          totalVeiculos: veiculosSnap.size,
          mesAtual: {
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

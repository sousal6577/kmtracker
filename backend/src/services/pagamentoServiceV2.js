// src/services/pagamentoServiceV2.js - Service de Pagamentos (Firestore)
import { collections, FieldValue, firestore } from '../config/firestore.js';

class PagamentoServiceV2 {
  constructor() {
    this.collection = collections.pagamentos;
  }

  /**
   * Lista pagamentos do mês atual
   */
  async listarMesAtual({ situacao = null, limite = 100 } = {}) {
    try {
      const mesAno = this.getMesAnoAtual();
      let query = this.collection.where('mesAno', '==', mesAno);
      
      if (situacao) {
        query = query.where('status', '==', situacao.toUpperCase());
      }
      
      // Removido orderBy para evitar necessidade de índice composto
      query = query.limit(limite);
      const snapshot = await query.get();
      
      // Ordena em memória
      const pagamentos = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.clienteNome || '').localeCompare(b.clienteNome || ''));

      return {
        success: true,
        pagamentos,
        mesAno,
        total: pagamentos.length
      };
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      throw { status: 500, message: 'Erro ao listar pagamentos' };
    }
  }

  /**
   * Lista pagamentos de um mês específico
   */
  async listarPorMes(mes, ano) {
    try {
      const mesAno = `${ano}-${String(mes).padStart(2, '0')}`;
      const snapshot = await this.collection
        .where('mesAno', '==', mesAno)
        .get();
      
      // Ordena em memória
      const pagamentos = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.clienteNome || '').localeCompare(b.clienteNome || ''));

      return {
        success: true,
        pagamentos,
        mesAno,
        total: pagamentos.length
      };
    } catch (error) {
      console.error('Erro ao listar pagamentos por mês:', error);
      throw { status: 500, message: 'Erro ao listar pagamentos' };
    }
  }

  /**
   * Confirma pagamento
   */
  async confirmarPagamento(pagamentoId, { formaPagamento = null, valorPago = null, usuario = null } = {}) {
    try {
      const docRef = this.collection.doc(pagamentoId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Pagamento não encontrado' };
      }

      const pagamentoData = doc.data();
      const valorFinal = valorPago !== null ? parseFloat(valorPago) : pagamentoData.valor;

      // Atualiza pagamento e veículo em transação
      await firestore.runTransaction(async (transaction) => {
        // Atualiza pagamento
        transaction.update(docRef, {
          status: 'PAGO',
          valorPago: valorFinal,
          dataPagamento: FieldValue.serverTimestamp(),
          formaPagamento: formaPagamento || 'Não informado',
          updatedAt: FieldValue.serverTimestamp(),
          registradoPor: usuario || 'sistema'
        });

        // Atualiza situação do veículo
        if (pagamentoData.veiculoId) {
          const veiculoRef = collections.veiculos.doc(pagamentoData.veiculoId);
          transaction.update(veiculoRef, {
            situacao: 'PAGO',
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      });

      return {
        success: true,
        message: 'Pagamento confirmado com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao confirmar pagamento:', error);
      throw { status: 500, message: 'Erro ao confirmar pagamento' };
    }
  }

  /**
   * Marca como pendente (desfaz pagamento)
   */
  async marcarPendente(pagamentoId, usuario = null) {
    try {
      const docRef = this.collection.doc(pagamentoId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Pagamento não encontrado' };
      }

      const pagamentoData = doc.data();

      await firestore.runTransaction(async (transaction) => {
        transaction.update(docRef, {
          status: 'PENDENTE',
          valorPago: 0,
          dataPagamento: null,
          formaPagamento: null,
          updatedAt: FieldValue.serverTimestamp(),
          registradoPor: usuario || 'sistema'
        });

        if (pagamentoData.veiculoId) {
          const veiculoRef = collections.veiculos.doc(pagamentoData.veiculoId);
          transaction.update(veiculoRef, {
            situacao: 'PENDENTE',
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      });

      return {
        success: true,
        message: 'Pagamento marcado como pendente'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao marcar pendente:', error);
      throw { status: 500, message: 'Erro ao marcar pendente' };
    }
  }

  /**
   * Lista pagamentos atrasados
   */
  async listarAtrasados() {
    try {
      const mesAno = this.getMesAnoAtual();
      const agora = new Date();
      const diaAtual = agora.getDate();

      // Busca pagamentos pendentes do mês
      const snapshot = await this.collection
        .where('mesAno', '==', mesAno)
        .where('status', '==', 'PENDENTE')
        .get();

      // Também busca os dados dos veículos para verificar vencimento
      const atrasados = [];
      
      for (const doc of snapshot.docs) {
        const pag = doc.data();
        
        // Busca dia de vencimento do veículo
        if (pag.veiculoId) {
          const veiculoDoc = await collections.veiculos.doc(pag.veiculoId).get();
          if (veiculoDoc.exists) {
            const diaVencimento = veiculoDoc.data().diaVencimento || 10;
            
            if (diaAtual > diaVencimento) {
              atrasados.push({
                id: doc.id,
                ...pag,
                diaVencimento,
                diasAtraso: diaAtual - diaVencimento
              });
              
              // Atualiza status para ATRASADO
              await doc.ref.update({ 
                status: 'ATRASADO',
                updatedAt: FieldValue.serverTimestamp()
              });
              await veiculoDoc.ref.update({
                situacao: 'ATRASADO',
                updatedAt: FieldValue.serverTimestamp()
              });
            }
          }
        }
      }

      return {
        success: true,
        atrasados,
        total: atrasados.length
      };
    } catch (error) {
      console.error('Erro ao listar atrasados:', error);
      throw { status: 500, message: 'Erro ao listar atrasados' };
    }
  }

  /**
   * Inicia novo mês (cria pagamentos para todos os veículos ativos)
   */
  async iniciarNovoMes(mes = null, ano = null, usuario = null) {
    try {
      const agora = new Date();
      const mesAlvo = mes || agora.getMonth() + 1;
      const anoAlvo = ano || agora.getFullYear();
      const mesAno = `${anoAlvo}-${String(mesAlvo).padStart(2, '0')}`;

      // Verifica se já existem pagamentos do mês
      const existentes = await this.collection.where('mesAno', '==', mesAno).limit(1).get();
      if (!existentes.empty) {
        throw { status: 409, message: `Pagamentos de ${mesAno} já existem` };
      }

      // Busca todos os veículos ativos
      const veiculosSnap = await collections.veiculos
        .where('statusVeiculo', '==', 'ativo')
        .get();

      if (veiculosSnap.empty) {
        return {
          success: true,
          message: 'Nenhum veículo ativo encontrado',
          pagamentosCriados: 0
        };
      }

      // Cria pagamentos em batch
      const batch = firestore.batch();
      let count = 0;

      for (const veiculoDoc of veiculosSnap.docs) {
        const veiculo = veiculoDoc.data();
        
        const pagamento = {
          veiculoId: veiculoDoc.id,
          clienteId: veiculo.clienteId,
          clienteCpf: veiculo.clienteCpf,
          clienteNome: veiculo.clienteNome,
          placa: veiculo.placa,
          
          ano: anoAlvo,
          mes: mesAlvo,
          mesAno,
          
          valor: veiculo.valor || 0,
          valorPago: 0,
          
          status: 'PENDENTE',
          dataPagamento: null,
          formaPagamento: null,
          
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          criadoPor: usuario || 'sistema'
        };

        const pagRef = this.collection.doc();
        batch.set(pagRef, pagamento);
        
        // Atualiza situação do veículo
        batch.update(veiculoDoc.ref, {
          situacao: 'PENDENTE',
          updatedAt: FieldValue.serverTimestamp()
        });
        
        count++;
      }

      await batch.commit();

      return {
        success: true,
        message: `Novo mês iniciado: ${mesAno}`,
        pagamentosCriados: count
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao iniciar novo mês:', error);
      throw { status: 500, message: 'Erro ao iniciar novo mês' };
    }
  }

  /**
   * Histórico de pagamentos de um cliente
   */
  async obterHistoricoCliente(clienteCpf) {
    try {
      const cpfNormalizado = clienteCpf.replace(/\D/g, '');
      
      const snapshot = await this.collection
        .where('clienteCpf', '==', cpfNormalizado)
        .orderBy('ano', 'desc')
        .orderBy('mes', 'desc')
        .limit(24) // Últimos 2 anos
        .get();

      const historico = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Agrupa por veículo
      const porVeiculo = {};
      historico.forEach(pag => {
        if (!porVeiculo[pag.placa]) {
          porVeiculo[pag.placa] = [];
        }
        porVeiculo[pag.placa].push(pag);
      });

      return {
        success: true,
        historico,
        porVeiculo,
        total: historico.length
      };
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      throw { status: 500, message: 'Erro ao obter histórico' };
    }
  }

  /**
   * Resumo financeiro do mês
   */
  async obterResumoMes(mes = null, ano = null) {
    try {
      const agora = new Date();
      const mesAlvo = mes || agora.getMonth() + 1;
      const anoAlvo = ano || agora.getFullYear();
      const mesAno = `${anoAlvo}-${String(mesAlvo).padStart(2, '0')}`;

      const snapshot = await this.collection.where('mesAno', '==', mesAno).get();

      let totalValor = 0;
      let totalPago = 0;
      let pendentes = 0;
      let pagos = 0;
      let atrasados = 0;

      snapshot.docs.forEach(doc => {
        const d = doc.data();
        totalValor += d.valor || 0;
        totalPago += d.valorPago || 0;
        
        if (d.status === 'PAGO') pagos++;
        else if (d.status === 'ATRASADO') atrasados++;
        else pendentes++;
      });

      return {
        success: true,
        resumo: {
          mesAno,
          totalVeiculos: snapshot.size,
          totalValor,
          totalPago,
          totalPendente: totalValor - totalPago,
          pendentes,
          pagos,
          atrasados,
          percentualRecebido: totalValor > 0 ? ((totalPago / totalValor) * 100).toFixed(1) : 0
        }
      };
    } catch (error) {
      console.error('Erro ao obter resumo:', error);
      throw { status: 500, message: 'Erro ao obter resumo' };
    }
  }

  /**
   * Dashboard de pagamentos
   */
  async obterDashboard() {
    try {
      const mesAno = this.getMesAnoAtual();
      const agora = new Date();
      
      // Resumo do mês atual
      const resumoAtual = await this.obterResumoMes();
      
      // Histórico dos últimos 6 meses
      const historico = [];
      for (let i = 0; i < 6; i++) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        
        const resumo = await this.obterResumoMes(mes, ano);
        historico.push({
          mesAno: `${ano}-${String(mes).padStart(2, '0')}`,
          ...resumo.resumo
        });
      }

      return {
        success: true,
        dashboard: {
          mesAtual: resumoAtual.resumo,
          historico: historico.reverse()
        }
      };
    } catch (error) {
      console.error('Erro ao obter dashboard:', error);
      throw { status: 500, message: 'Erro ao obter dashboard' };
    }
  }

  getMesAnoAtual() {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
  }
}

export default new PagamentoServiceV2();

// src/services/cronService.js - Serviço de Tarefas Agendadas
import { collections, FieldValue, firestore } from '../config/firestore.js';

class CronService {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
  }

  /**
   * Inicia o serviço de cron
   */
  start() {
    console.log('🕐 CronService iniciado');
    
    // Executa imediatamente ao iniciar para verificar pendências
    this.verificarEExecutarTarefas();
    
    // Configura intervalo para verificar a cada hora
    setInterval(() => {
      this.verificarEExecutarTarefas();
    }, 60 * 60 * 1000); // 1 hora
  }

  /**
   * Verifica se deve executar tarefas e executa
   */
  async verificarEExecutarTarefas() {
    const agora = new Date();
    const hora = agora.getHours();
    
    console.log(`[CRON ${agora.toISOString()}] Verificando tarefas...`);

    // Executa tarefas entre 2h e 4h da madrugada
    if (hora >= 2 && hora <= 4) {
      await this.executarTarefasDiarias();
    }

    // Sempre verifica atrasados
    await this.atualizarStatusAtrasados();
  }

  /**
   * Executa tarefas diárias (início de mês, etc)
   */
  async executarTarefasDiarias() {
    if (this.isRunning) {
      console.log('[CRON] Tarefa já em execução, pulando...');
      return;
    }

    this.isRunning = true;
    const agora = new Date();
    const diaDoMes = agora.getDate();

    try {
      // Primeiro dia do mês - Iniciar novo mês
      if (diaDoMes === 1) {
        await this.iniciarNovoMesAutomatico();
      }

      // Dia 15 - Enviar alertas de pendências
      if (diaDoMes === 15) {
        await this.gerarRelatorioMeioMes();
      }

      this.lastRun = agora;
    } catch (error) {
      console.error('[CRON] Erro na execução:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Inicia novo mês automaticamente mantendo histórico de atrasos
   */
  async iniciarNovoMesAutomatico() {
    console.log('[CRON] Iniciando novo mês automaticamente...');
    
    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();
    const mesAno = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`;

    try {
      // Verifica se já existem pagamentos do mês atual
      const pagamentosExistentes = await collections.pagamentos
        .where('mesAno', '==', mesAno)
        .limit(1)
        .get();

      if (!pagamentosExistentes.empty) {
        console.log(`[CRON] Pagamentos de ${mesAno} já existem. Pulando criação.`);
        return { success: true, message: 'Mês já iniciado', pagamentosCriados: 0 };
      }

      // Primeiro, armazena o histórico do mês anterior
      await this.arquivarMesAnterior();

      // Busca todos os veículos ativos
      const veiculosSnap = await collections.veiculos
        .where('statusVeiculo', '==', 'ativo')
        .get();

      if (veiculosSnap.empty) {
        console.log('[CRON] Nenhum veículo ativo encontrado');
        return { success: true, message: 'Sem veículos ativos', pagamentosCriados: 0 };
      }

      // Busca atrasos acumulados por veículo
      const atrasosAcumulados = await this.calcularAtrasosAcumulados();

      // Cria pagamentos em batch
      const batch = firestore.batch();
      let count = 0;

      for (const veiculoDoc of veiculosSnap.docs) {
        const veiculo = veiculoDoc.data();
        const veiculoId = veiculoDoc.id;
        
        // Calcula valor com possíveis atrasos acumulados
        const atrasoVeiculo = atrasosAcumulados[veiculoId] || { mesesAtrasados: 0, valorAtrasado: 0 };
        
        const pagamento = {
          veiculoId: veiculoId,
          clienteId: veiculo.clienteId,
          clienteCpf: veiculo.clienteCpf,
          clienteNome: veiculo.clienteNome,
          placa: veiculo.placa,
          modelo: veiculo.modelo || '',
          tipoVeiculo: veiculo.tipoVeiculo || 'carro',
          telefone: veiculo.telefone || '',
          
          ano: anoAtual,
          mes: mesAtual,
          mesAno,
          diaVencimento: veiculo.diaVencimento || 10,
          
          valor: veiculo.valor || 0,
          valorPago: 0,
          
          // Informações de atraso acumulado
          mesesAtrasados: atrasoVeiculo.mesesAtrasados,
          valorAtrasado: atrasoVeiculo.valorAtrasado,
          
          status: 'PENDENTE',
          dataPagamento: null,
          formaPagamento: null,
          
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          criadoPor: 'cron-automatico'
        };

        const pagRef = collections.pagamentos.doc();
        batch.set(pagRef, pagamento);
        
        // Atualiza situação do veículo
        batch.update(veiculoDoc.ref, {
          situacao: 'PENDENTE',
          updatedAt: FieldValue.serverTimestamp()
        });
        
        count++;
      }

      await batch.commit();

      console.log(`[CRON] ✅ Novo mês ${mesAno} iniciado com ${count} pagamentos`);
      
      // Registra log da execução
      await this.registrarLogExecucao('NOVO_MES', {
        mesAno,
        pagamentosCriados: count,
        executadoEm: new Date().toISOString()
      });

      return {
        success: true,
        message: `Novo mês iniciado: ${mesAno}`,
        pagamentosCriados: count
      };
    } catch (error) {
      console.error('[CRON] Erro ao iniciar novo mês:', error);
      await this.registrarLogExecucao('ERRO_NOVO_MES', {
        erro: error.message,
        executadoEm: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Arquiva o mês anterior (mantém histórico)
   */
  async arquivarMesAnterior() {
    const agora = new Date();
    const mesAnterior = agora.getMonth() === 0 ? 12 : agora.getMonth();
    const anoAnterior = agora.getMonth() === 0 ? agora.getFullYear() - 1 : agora.getFullYear();
    const mesAnoAnterior = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}`;

    console.log(`[CRON] Arquivando mês ${mesAnoAnterior}...`);

    try {
      const pagamentosAnterior = await collections.pagamentos
        .where('mesAno', '==', mesAnoAnterior)
        .get();

      if (pagamentosAnterior.empty) {
        console.log('[CRON] Nenhum pagamento do mês anterior para arquivar');
        return;
      }

      const batch = firestore.batch();
      let atrasadosCount = 0;
      let pagosCount = 0;
      let valorTotalAtrasado = 0;

      for (const doc of pagamentosAnterior.docs) {
        const pag = doc.data();
        
        // Marca pagamentos não pagos como ATRASADO_HISTORICO
        if (pag.status !== 'PAGO') {
          batch.update(doc.ref, {
            status: 'ATRASADO_HISTORICO',
            arquivadoEm: FieldValue.serverTimestamp()
          });
          atrasadosCount++;
          valorTotalAtrasado += pag.valor || 0;
        } else {
          pagosCount++;
        }
      }

      await batch.commit();

      console.log(`[CRON] Mês ${mesAnoAnterior} arquivado: ${pagosCount} pagos, ${atrasadosCount} atrasados (R$ ${valorTotalAtrasado.toFixed(2)})`);

      // Cria registro de histórico mensal
      await collections.pagamentos.doc(`historico_${mesAnoAnterior}`).set({
        mesAno: mesAnoAnterior,
        totalPagamentos: pagamentosAnterior.size,
        pagos: pagosCount,
        atrasados: atrasadosCount,
        valorTotalAtrasado,
        arquivadoEm: FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('[CRON] Erro ao arquivar mês:', error);
    }
  }

  /**
   * Calcula atrasos acumulados por veículo
   */
  async calcularAtrasosAcumulados() {
    try {
      // Busca todos os pagamentos com status ATRASADO ou ATRASADO_HISTORICO
      const atrasadosSnap = await collections.pagamentos
        .where('status', 'in', ['ATRASADO', 'ATRASADO_HISTORICO', 'PENDENTE'])
        .get();

      const atrasosPorVeiculo = {};
      const agora = new Date();
      const mesAtualNum = (agora.getFullYear() * 12) + agora.getMonth();

      atrasadosSnap.docs.forEach(doc => {
        const pag = doc.data();
        if (pag.status === 'PAGO') return;
        
        const veiculoId = pag.veiculoId;
        if (!veiculoId) return;

        // Calcula diferença de meses
        const pagMesNum = (pag.ano * 12) + (pag.mes - 1);
        const mesesDiferenca = mesAtualNum - pagMesNum;

        if (mesesDiferenca > 0) { // Só conta se for de meses anteriores
          if (!atrasosPorVeiculo[veiculoId]) {
            atrasosPorVeiculo[veiculoId] = {
              mesesAtrasados: 0,
              valorAtrasado: 0,
              detalhes: []
            };
          }

          atrasosPorVeiculo[veiculoId].mesesAtrasados++;
          atrasosPorVeiculo[veiculoId].valorAtrasado += pag.valor || 0;
          atrasosPorVeiculo[veiculoId].detalhes.push({
            mesAno: pag.mesAno,
            valor: pag.valor
          });
        }
      });

      return atrasosPorVeiculo;
    } catch (error) {
      console.error('[CRON] Erro ao calcular atrasos:', error);
      return {};
    }
  }

  /**
   * Atualiza status de pagamentos atrasados
   */
  async atualizarStatusAtrasados() {
    const agora = new Date();
    const mesAno = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    const diaAtual = agora.getDate();

    try {
      // Busca pagamentos pendentes do mês atual
      const snapshot = await collections.pagamentos
        .where('mesAno', '==', mesAno)
        .where('status', '==', 'PENDENTE')
        .get();

      if (snapshot.empty) {
        return;
      }

      const batch = firestore.batch();
      let atrasadosCount = 0;

      for (const doc of snapshot.docs) {
        const pag = doc.data();
        const diaVencimento = pag.diaVencimento || 10;

        if (diaAtual > diaVencimento) {
          batch.update(doc.ref, {
            status: 'ATRASADO',
            diasAtraso: diaAtual - diaVencimento,
            updatedAt: FieldValue.serverTimestamp()
          });

          // Atualiza veículo também
          if (pag.veiculoId) {
            const veiculoRef = collections.veiculos.doc(pag.veiculoId);
            batch.update(veiculoRef, {
              situacao: 'ATRASADO',
              updatedAt: FieldValue.serverTimestamp()
            });
          }

          atrasadosCount++;
        }
      }

      if (atrasadosCount > 0) {
        await batch.commit();
        console.log(`[CRON] ${atrasadosCount} pagamentos marcados como atrasados`);
      }

    } catch (error) {
      console.error('[CRON] Erro ao atualizar atrasados:', error);
    }
  }

  /**
   * Gera relatório de meio de mês
   */
  async gerarRelatorioMeioMes() {
    console.log('[CRON] Gerando relatório de meio de mês...');
    
    try {
      const mesAno = this.getMesAnoAtual();
      const snapshot = await collections.pagamentos
        .where('mesAno', '==', mesAno)
        .get();

      let pendentes = 0;
      let pagos = 0;
      let atrasados = 0;
      let valorPendente = 0;
      let valorPago = 0;

      snapshot.docs.forEach(doc => {
        const d = doc.data();
        if (d.status === 'PAGO') {
          pagos++;
          valorPago += d.valorPago || d.valor || 0;
        } else if (d.status === 'ATRASADO') {
          atrasados++;
          valorPendente += d.valor || 0;
        } else {
          pendentes++;
          valorPendente += d.valor || 0;
        }
      });

      const relatorio = {
        mesAno,
        data: new Date().toISOString(),
        totalVeiculos: snapshot.size,
        pagos,
        pendentes,
        atrasados,
        valorPago,
        valorPendente,
        percentualPago: snapshot.size > 0 ? ((pagos / snapshot.size) * 100).toFixed(1) : 0
      };

      console.log('[CRON] Relatório de meio de mês:', relatorio);

      await this.registrarLogExecucao('RELATORIO_MEIO_MES', relatorio);

      return relatorio;
    } catch (error) {
      console.error('[CRON] Erro ao gerar relatório:', error);
    }
  }

  /**
   * Registra log de execução
   */
  async registrarLogExecucao(tipo, dados) {
    try {
      await firestore.collection('cron_logs').add({
        tipo,
        dados,
        executadoEm: FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('[CRON] Erro ao registrar log:', error);
    }
  }

  getMesAnoAtual() {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Força execução do início de mês (para teste/admin)
   */
  async forcarInicioMes() {
    return this.iniciarNovoMesAutomatico();
  }

  /**
   * Obtém status do cron
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      mesAtual: this.getMesAnoAtual()
    };
  }
}

export default new CronService();

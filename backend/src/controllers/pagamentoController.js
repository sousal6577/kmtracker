// src/controllers/pagamentoController.js - Controller de Pagamentos
import pagamentoService from '../services/pagamentoServiceV2.js';

class PagamentoController {
  /**
   * GET /api/pagamentos - Lista pagamentos do mês atual
   */
  async listar(req, res) {
    try {
      const { mes, ano } = req.query;
      
      let result;
      if (mes && ano) {
        result = await pagamentoService.listarPorMes(parseInt(mes), parseInt(ano));
      } else {
        result = await pagamentoService.listarMesAtual();
      }
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/pagamentos/confirmar
   */
  async confirmar(req, res) {
    try {
      const { pagamentoId, veiculoId, cpf } = req.body;

      // Aceita pagamentoId OU veiculoId
      const id = pagamentoId || veiculoId;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'pagamentoId ou veiculoId é obrigatório' 
        });
      }

      const result = await pagamentoService.confirmarPagamento(id);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/pagamentos/pendente
   */
  async marcarPendente(req, res) {
    try {
      const { pagamentoId, veiculoId, cpf } = req.body;

      const id = pagamentoId || veiculoId;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'pagamentoId ou veiculoId é obrigatório' 
        });
      }

      const result = await pagamentoService.marcarPendente(id);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/pagamentos/atrasados
   */
  async listarAtrasados(req, res) {
    try {
      const result = await pagamentoService.listarAtrasados();
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/pagamentos/novo-mes
   */
  async iniciarNovoMes(req, res) {
    try {
      const result = await pagamentoService.iniciarNovoMes();
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/pagamentos/historico/:clienteId
   */
  async obterHistorico(req, res) {
    try {
      const { clienteId } = req.params;

      if (!clienteId) {
        return res.status(400).json({ 
          success: false, 
          message: 'clienteId é obrigatório' 
        });
      }

      const result = await pagamentoService.obterHistoricoCliente(clienteId);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/pagamentos/resumo
   */
  async obterResumo(req, res) {
    try {
      const { mes, ano } = req.query;
      const result = await pagamentoService.obterResumoMes(
        mes ? parseInt(mes) : undefined, 
        ano ? parseInt(ano) : undefined
      );
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/pagamentos/dashboard
   */
  async dashboard(req, res) {
    try {
      const result = await pagamentoService.obterDashboard();
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

export default new PagamentoController();

// src/controllers/veiculoController.js - Controller de Veículos
import veiculoService from '../services/veiculoServiceV2.js';

class VeiculoController {
  /**
   * GET /api/veiculos
   */
  async listar(req, res) {
    try {
      const { clienteId, limite, ultimoId } = req.query;
      
      let result;
      if (clienteId) {
        result = await veiculoService.listarPorCliente(clienteId);
      } else {
        result = await veiculoService.listar({ 
          limite: limite ? parseInt(limite) : 100, 
          ultimoId 
        });
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
   * GET /api/veiculos/:id
   */
  async obter(req, res) {
    try {
      const { id } = req.params;
      const result = await veiculoService.obterPorId(id);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/veiculos
   */
  async adicionar(req, res) {
    try {
      const dados = req.body;

      // Validação básica
      const camposObrigatorios = ['clienteId', 'placa'];
      const camposFaltando = camposObrigatorios.filter(campo => !dados[campo]);
      
      if (camposFaltando.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Campos obrigatórios: ${camposFaltando.join(', ')}` 
        });
      }

      const result = await veiculoService.criar(dados);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * PUT /api/veiculos/:id
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      
      const result = await veiculoService.atualizar(id, dados);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * DELETE /api/veiculos/:id
   */
  async excluir(req, res) {
    try {
      const { id } = req.params;
      const result = await veiculoService.excluir(id);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/veiculos/buscar?placa=xxx&termo=xxx
   */
  async buscar(req, res) {
    try {
      const { placa, termo } = req.query;
      
      let result;
      if (placa) {
        result = await veiculoService.obterPorPlaca(placa);
      } else if (termo) {
        result = await veiculoService.buscar(termo);
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Parâmetro placa ou termo é obrigatório' 
        });
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
   * GET /api/veiculos/estatisticas
   */
  async estatisticas(req, res) {
    try {
      const result = await veiculoService.obterEstatisticas();
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

export default new VeiculoController();

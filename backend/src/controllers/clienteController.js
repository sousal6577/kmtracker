// src/controllers/clienteController.js - Controller de Clientes
import clienteService from '../services/clienteServiceV2.js';

class ClienteController {
  /**
   * GET /api/clientes
   */
  async listar(req, res) {
    try {
      const { limite, ultimoId } = req.query;
      const result = await clienteService.listar({ 
        limite: limite ? parseInt(limite) : 50, 
        ultimoId 
      });
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/clientes/:cpf
   */
  async obter(req, res) {
    try {
      const { cpf } = req.params;
      const result = await clienteService.obterPorCpf(cpf);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * POST /api/clientes
   */
  async registrar(req, res) {
    try {
      const dados = req.body;

      // Validação básica
      const camposObrigatorios = ['cpf', 'nome'];
      const camposFaltando = camposObrigatorios.filter(campo => !dados[campo]);
      
      if (camposFaltando.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Campos obrigatórios: ${camposFaltando.join(', ')}` 
        });
      }

      const result = await clienteService.criar(dados);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/clientes/buscar?termo=xxx
   */
  async buscar(req, res) {
    try {
      const { termo } = req.query;
      
      if (!termo) {
        return res.status(400).json({ 
          success: false, 
          message: 'Termo de busca é obrigatório' 
        });
      }

      const result = await clienteService.buscar(termo);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * GET /api/clientes/estatisticas
   */
  async estatisticas(req, res) {
    try {
      const result = await clienteService.obterEstatisticas();
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

export default new ClienteController();

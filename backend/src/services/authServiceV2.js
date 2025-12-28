// src/services/authServiceV2.js - Service de Autenticação (Apenas Firestore)
import { collections, FieldValue, auth } from '../config/firestore.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'KmTracker_Secret_Key_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthServiceV2 {
  constructor() {
    this.collection = collections.usuarios;
  }

  /**
   * Login do usuário (suporta username ou email)
   */
  async login(username, password) {
    try {
      if (!username || !password) {
        throw { status: 400, message: 'Usuário e senha são obrigatórios' };
      }

      // Detecta se é email ou username
      const isEmail = username.includes('@');
      let userData = null;
      let userId = null;

      if (isEmail) {
        // Login por email - busca no Firestore
        const query = await this.collection.where('email', '==', username.toLowerCase()).get();
        if (!query.empty) {
          const doc = query.docs[0];
          userData = doc.data();
          userId = doc.id;
        }
      } else {
        // Login por username - normaliza para lowercase
        const usernameNormalizado = username.toLowerCase().trim();
        const doc = await this.collection.doc(usernameNormalizado).get();
        if (doc.exists) {
          userData = doc.data();
          userId = doc.id;
        }
      }

      if (!userData) {
        throw { status: 401, message: 'Credenciais inválidas' };
      }

      if (userData.ativo === false) {
        throw { status: 403, message: 'Usuário desativado' };
      }

      // Verifica senha
      let senhaValida = false;
      
      // Senha legada em texto plano (migração)
      if (userData.senhaLegado && userData.senhaLegado === password) {
        senhaValida = true;
      }
      // Senha com bcrypt
      else if (userData.senha) {
        senhaValida = await bcrypt.compare(password, userData.senha);
      }

      if (!senhaValida) {
        throw { status: 401, message: 'Credenciais inválidas' };
      }

      // Atualiza último login
      await this.collection.doc(userId).update({
        ultimoLogin: FieldValue.serverTimestamp()
      });

      // Gera token
      const token = this.generateToken({
        id: userId,
        nome: userData.nome || userId,
        email: userData.email,
        role: userData.role || 'user',
        primeiroAcesso: userData.primeiroAcesso || false
      });

      return {
        success: true,
        message: 'Login realizado com sucesso',
        token,
        primeiroAcesso: userData.primeiroAcesso || false,
        user: {
          id: userId,
          nome: userData.nome || userId,
          email: userData.email,
          role: userData.role || 'user',
          primeiroAcesso: userData.primeiroAcesso || false
        }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro no login:', error);
      throw { status: 500, message: 'Erro ao realizar login' };
    }
  }

  /**
   * Troca de senha (primeiro acesso ou alteração)
   */
  async trocarSenha(userId, senhaAtual, novaSenha) {
    try {
      if (!novaSenha || novaSenha.length < 6) {
        throw { status: 400, message: 'A nova senha deve ter pelo menos 6 caracteres' };
      }

      // Busca usuário no Firestore
      const doc = await this.collection.doc(userId.toLowerCase()).get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Usuário não encontrado' };
      }

      const userData = doc.data();

      // Verifica senha atual (se não for primeiro acesso)
      if (!userData.primeiroAcesso && senhaAtual) {
        let senhaValida = false;
        if (userData.senhaLegado && userData.senhaLegado === senhaAtual) {
          senhaValida = true;
        } else if (userData.senha) {
          senhaValida = await bcrypt.compare(senhaAtual, userData.senha);
        }
        if (!senhaValida) {
          throw { status: 401, message: 'Senha atual incorreta' };
        }
      }

      // Hash da nova senha
      const senhaHash = await bcrypt.hash(novaSenha, 10);

      // Atualiza no Firestore
      await doc.ref.update({
        senha: senhaHash,
        senhaLegado: FieldValue.delete(),
        primeiroAcesso: false,
        updatedAt: FieldValue.serverTimestamp()
      });

      // Atualiza também no Firebase Auth se existir
      if (userData.uid) {
        try {
          await auth.updateUser(userData.uid, { password: novaSenha });
        } catch (e) {
          console.log('Aviso: Não foi possível atualizar no Firebase Auth');
        }
      }

      return {
        success: true,
        message: 'Senha alterada com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao trocar senha:', error);
      throw { status: 500, message: 'Erro ao alterar senha' };
    }
  }

  /**
   * Cria novo usuário
   */
  async criarUsuario(dados, usuarioAtual = null) {
    try {
      const { nome, email, senha, role = 'operador', primeiroAcesso = true } = dados;
      
      if (!nome || !senha) {
        throw { status: 400, message: 'Nome e senha são obrigatórios' };
      }

      const usernameNormalizado = nome.toLowerCase().trim().replace(/\s+/g, '_');
      
      // Verifica se já existe por username
      const existente = await this.collection.doc(usernameNormalizado).get();
      if (existente.exists) {
        throw { status: 409, message: 'Usuário já existe' };
      }

      // Verifica se email já existe
      if (email) {
        const emailQuery = await this.collection.where('email', '==', email.toLowerCase()).get();
        if (!emailQuery.empty) {
          throw { status: 409, message: 'Email já cadastrado' };
        }
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = {
        nome: nome.toUpperCase().trim(),
        email: email?.toLowerCase().trim() || `${usernameNormalizado}@kmtracker.com`,
        senha: senhaHash,
        senhaLegado: primeiroAcesso ? senha : null, // Mantém senha legada para primeiro acesso
        role,
        ativo: true,
        primeiroAcesso,
        ultimoLogin: null,
        createdAt: FieldValue.serverTimestamp(),
        criadoPor: usuarioAtual || 'sistema'
      };

      await this.collection.doc(usernameNormalizado).set(novoUsuario);

      return {
        success: true,
        message: 'Usuário criado com sucesso',
        user: {
          id: usernameNormalizado,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          role: novoUsuario.role
        }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao criar usuário:', error);
      throw { status: 500, message: 'Erro ao criar usuário' };
    }
  }

  /**
   * Lista usuários
   */
  async listarUsuarios() {
    try {
      const snapshot = await this.collection.get();
      
      const usuarios = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          nome: d.nome,
          email: d.email,
          role: d.role,
          ativo: d.ativo,
          ultimoLogin: d.ultimoLogin
        };
      });

      return {
        success: true,
        usuarios,
        total: usuarios.length
      };
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw { status: 500, message: 'Erro ao listar usuários' };
    }
  }

  /**
   * Obtém usuário por ID
   */
  async obterUsuario(id) {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Usuário não encontrado' };
      }

      const d = doc.data();
      return {
        success: true,
        user: {
          id: doc.id,
          nome: d.nome,
          email: d.email,
          role: d.role,
          ativo: d.ativo,
          primeiroAcesso: d.primeiroAcesso,
          ultimoLogin: d.ultimoLogin
        }
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao obter usuário:', error);
      throw { status: 500, message: 'Erro ao obter usuário' };
    }
  }

  /**
   * Atualiza usuário
   */
  async atualizarUsuario(id, dados, usuarioAtual = null) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Usuário não encontrado' };
      }

      const atualizacao = { updatedAt: FieldValue.serverTimestamp() };
      
      if (dados.email) atualizacao.email = dados.email.toLowerCase().trim();
      if (dados.role) atualizacao.role = dados.role;
      if (dados.ativo !== undefined) atualizacao.ativo = dados.ativo;
      
      if (dados.novaSenha) {
        atualizacao.senha = await bcrypt.hash(dados.novaSenha, 10);
        atualizacao.senhaLegado = FieldValue.delete();
      }

      await docRef.update(atualizacao);

      return {
        success: true,
        message: 'Usuário atualizado com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao atualizar usuário:', error);
      throw { status: 500, message: 'Erro ao atualizar usuário' };
    }
  }

  /**
   * Deleta usuário
   */
  async deletarUsuario(id) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw { status: 404, message: 'Usuário não encontrado' };
      }

      await docRef.delete();

      return {
        success: true,
        message: 'Usuário deletado com sucesso'
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Erro ao deletar usuário:', error);
      throw { status: 500, message: 'Erro ao deletar usuário' };
    }
  }

  /**
   * Gera token JWT
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verifica token JWT
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

export default new AuthServiceV2();

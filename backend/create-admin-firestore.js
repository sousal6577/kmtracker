// Script para criar usuário admin no Firestore
import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const firestore = admin.firestore();

async function criarUsuarioAdmin() {
  try {
    const email = 'lgcdsousa@gmail.com';
    const senha = 'mudar123';
    const nome = 'ADMIN';
    const userId = 'admin'; // ID do documento no Firestore

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Dados do usuário
    const userData = {
      nome: nome,
      email: email.toLowerCase(),
      senha: senhaHash,
      senhaLegado: senha, // Para primeiro acesso
      role: 'admin',
      ativo: true,
      primeiroAcesso: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      criadoPor: 'sistema'
    };

    // Verifica se já existe
    const existente = await firestore.collection('usuarios').doc(userId).get();
    
    if (existente.exists) {
      // Atualiza usuário existente
      await firestore.collection('usuarios').doc(userId).update({
        email: email.toLowerCase(),
        senha: senhaHash,
        senhaLegado: senha,
        primeiroAcesso: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Usuário admin atualizado!');
    } else {
      // Cria novo usuário
      await firestore.collection('usuarios').doc(userId).set(userData);
      console.log('✅ Usuário admin criado com sucesso!');
    }

    console.log('\n📋 Dados do usuário:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${senha}`);
    console.log(`   ID: ${userId}`);
    console.log('\n⚠️  IMPORTANTE: Troque a senha no primeiro acesso!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    process.exit(1);
  }
}

criarUsuarioAdmin();

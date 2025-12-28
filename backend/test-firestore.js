// test-firestore.js - Testa conexão com Firestore
import admin from 'firebase-admin';
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
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const firestore = admin.firestore();

async function testFirestore() {
  console.log('\n🔍 Testando conexão com Firestore...\n');
  
  try {
    // Lista coleções existentes
    const collections = await firestore.listCollections();
    console.log('✅ FIRESTORE ESTÁ ATIVO!');
    console.log(`📁 Coleções existentes: ${collections.length}`);
    
    if (collections.length > 0) {
      collections.forEach(col => console.log(`   - ${col.id}`));
    } else {
      console.log('   (nenhuma coleção criada ainda)');
    }
    
    // Tenta escrever um documento de teste
    console.log('\n📝 Testando escrita...');
    const testRef = firestore.collection('_test_connection').doc('test');
    await testRef.set({ 
      status: 'connected',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Firestore funcionando!'
    });
    console.log('✅ Escrita: OK');
    
    // Lê o documento
    console.log('📖 Testando leitura...');
    const doc = await testRef.get();
    console.log('✅ Leitura: OK -', doc.data());
    
    // Deleta o documento de teste
    await testRef.delete();
    console.log('🗑️  Documento de teste removido\n');
    
    console.log('═══════════════════════════════════════');
    console.log('🎉 FIRESTORE PRONTO PARA MIGRAÇÃO!');
    console.log('═══════════════════════════════════════\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERRO ao conectar com Firestore:', error.message);
    
    if (error.code === 9 || error.message.includes('NOT_FOUND') || error.message.includes('FAILED_PRECONDITION')) {
      console.log('\n⚠️  O Firestore pode não estar habilitado ou está em modo Datastore.');
      console.log('🔗 Acesse: https://console.firebase.google.com/project/kmtracker-e1f30/firestore');
      console.log('   E selecione "Native mode" ao criar o banco.\n');
    }
    
    return false;
  } finally {
    process.exit(0);
  }
}

testFirestore();

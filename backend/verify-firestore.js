// verify-firestore.js - Verifica dados migrados
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const firestore = admin.firestore();

async function verificar() {
  console.log('\n📊 VERIFICANDO DADOS NO FIRESTORE:\n');
  
  const collections = ['clientes', 'veiculos', 'pagamentos', 'usuarios', 'configuracoes'];
  
  for (const col of collections) {
    const snap = await firestore.collection(col).get();
    console.log(`📁 ${col}: ${snap.size} documentos`);
    
    if (snap.size > 0) {
      const primeiro = snap.docs[0];
      const data = primeiro.data();
      console.log(`   ID: ${primeiro.id}`);
      
      // Mostra alguns campos principais
      if (col === 'clientes') {
        console.log(`   → Nome: ${data.nome}, CPF: ${data.cpf}, Veículos: ${data.totalVeiculos}`);
      } else if (col === 'veiculos') {
        console.log(`   → Placa: ${data.placa}, Modelo: ${data.modelo}, Situação: ${data.situacao}`);
      } else if (col === 'pagamentos') {
        console.log(`   → Placa: ${data.placa}, Mês/Ano: ${data.mesAno}, Status: ${data.status}, Valor: R$${data.valor}`);
      } else if (col === 'usuarios') {
        console.log(`   → Nome: ${data.nome}, Role: ${data.role}`);
      }
    }
    console.log('');
  }
  
  // Testa algumas queries
  console.log('🔍 TESTANDO QUERIES:\n');
  
  // Veículos pendentes
  const pendentes = await firestore.collection('veiculos').where('situacao', '==', 'PENDENTE').get();
  console.log(`   Veículos PENDENTES: ${pendentes.size}`);
  
  // Veículos pagos
  const pagos = await firestore.collection('veiculos').where('situacao', '==', 'PAGO').get();
  console.log(`   Veículos PAGOS: ${pagos.size}`);
  
  // Pagamentos do mês atual
  const agora = new Date();
  const mesAno = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
  const pagamentosMes = await firestore.collection('pagamentos').where('mesAno', '==', mesAno).get();
  console.log(`   Pagamentos ${mesAno}: ${pagamentosMes.size}`);
  
  // Soma valores
  let totalValor = 0;
  let totalPago = 0;
  pagamentosMes.forEach(doc => {
    const d = doc.data();
    totalValor += d.valor || 0;
    totalPago += d.valorPago || 0;
  });
  console.log(`   Total a receber: R$ ${totalValor.toFixed(2)}`);
  console.log(`   Total recebido: R$ ${totalPago.toFixed(2)}`);
  
  console.log('\n✅ Firestore funcionando perfeitamente!\n');
  
  process.exit(0);
}

verificar();

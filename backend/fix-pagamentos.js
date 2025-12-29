// Script para corrigir veículos e criar pagamentos do mês
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('../serviceAccountKey.json', 'utf8'));
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function fix() {
  console.log('=== Iniciando correção ===\n');
  
  // 1. Corrige statusVeiculo
  console.log('1. Verificando veículos...');
  const veiculos = await db.collection('veiculos').get();
  const batch = db.batch();
  let count = 0;
  
  for (const doc of veiculos.docs) {
    const data = doc.data();
    if (!data.statusVeiculo) {
      batch.update(doc.ref, { statusVeiculo: 'ativo' });
      count++;
    }
  }
  
  if (count > 0) {
    await batch.commit();
    console.log(`   ✅ Atualizados ${count} veículos com statusVeiculo=ativo`);
  } else {
    console.log('   ✓ Todos os veículos já têm statusVeiculo');
  }
  
  // 2. Cria pagamentos do mês
  console.log('\n2. Criando pagamentos de dezembro 2025...');
  
  const mesAno = '2025-12';
  
  // Verifica se já existem
  const existentes = await db.collection('pagamentos').where('mesAno', '==', mesAno).limit(1).get();
  if (!existentes.empty) {
    console.log('   ⚠️ Pagamentos de 2025-12 já existem. Pulando...');
    process.exit(0);
  }
  
  const veiculosAtivos = await db.collection('veiculos').where('statusVeiculo', '==', 'ativo').get();
  console.log(`   Veículos ativos encontrados: ${veiculosAtivos.size}`);
  
  if (veiculosAtivos.empty) {
    console.log('   ⚠️ Nenhum veículo ativo encontrado!');
    process.exit(0);
  }
  
  // Busca clientes
  const clientes = await db.collection('clientes').get();
  const clientesMap = {};
  clientes.docs.forEach(doc => {
    const data = doc.data();
    clientesMap[doc.id] = data;
    if (data.cpf) {
      clientesMap[data.cpf.replace(/\D/g, '')] = data;
    }
  });
  
  const batch2 = db.batch();
  let pagCount = 0;
  
  for (const vDoc of veiculosAtivos.docs) {
    const v = vDoc.data();
    const cliente = clientesMap[v.clienteId] || clientesMap[v.clienteCpf] || {};
    
    const pag = {
      veiculoId: vDoc.id,
      clienteId: v.clienteId || '',
      clienteCpf: v.clienteCpf || '',
      clienteNome: v.clienteNome || '',
      placa: v.placa || '',
      modelo: v.modelo || '',
      tipoVeiculo: v.tipoVeiculo || 'carro',
      telefone: cliente.telefone || v.telefone || '',
      ano: 2025,
      mes: 12,
      mesAno: mesAno,
      diaVencimento: v.diaVencimento || 10,
      valor: v.valor || 0,
      valorPago: 0,
      status: 'PENDENTE',
      dataPagamento: null,
      formaPagamento: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPor: 'script-fix'
    };
    
    const pagRef = db.collection('pagamentos').doc();
    batch2.set(pagRef, pag);
    
    batch2.update(vDoc.ref, { 
      situacao: 'PENDENTE', 
      updatedAt: new Date() 
    });
    
    pagCount++;
  }
  
  await batch2.commit();
  console.log(`   ✅ Criados ${pagCount} pagamentos para ${mesAno}`);
  
  // 3. Verifica
  console.log('\n3. Verificação final...');
  const pagsFinais = await db.collection('pagamentos').where('mesAno', '==', mesAno).get();
  console.log(`   Total pagamentos em 2025-12: ${pagsFinais.size}`);
  
  let totalValor = 0;
  pagsFinais.docs.forEach(doc => {
    totalValor += doc.data().valor || 0;
  });
  console.log(`   Valor total esperado: R$ ${totalValor.toFixed(2)}`);
  
  console.log('\n=== Correção concluída! ===');
}

fix().then(() => process.exit(0)).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});

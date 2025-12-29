// Script de Migração - Realtime Database para Firestore
import admin from 'firebase-admin';
import fs from 'fs';
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

// Lê o arquivo de export
const data = JSON.parse(fs.readFileSync('../kmtracker-e1f30-default-rtdb-export.json', 'utf8'));

async function migrarDados() {
  console.log('🚀 Iniciando migração...\n');

  const clientesMap = new Map(); // CPF -> dados do cliente
  const veiculosArray = [];
  const pagamentosArray = [];

  // Mapeamento de meses
  const mesesMap = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };

  // Processa todos os dados
  for (const [ano, meses] of Object.entries(data.CLIENTES || {})) {
    for (const [mesNome, clientes] of Object.entries(meses || {})) {
      const mesNumero = mesesMap[mesNome.toLowerCase()] || '01';
      const mesAno = `${ano}-${mesNumero}`;

      for (const [cpf, clienteData] of Object.entries(clientes || {})) {
        const dadosGeral = clienteData.DADOS_GERAL || {};

        for (const [veiculoId, veiculo] of Object.entries(dadosGeral)) {
          // Atualiza/cria cliente
          if (!clientesMap.has(cpf)) {
            clientesMap.set(cpf, {
              cpf: cpf,
              nome: veiculo.nome || '',
              email: veiculo.email || '',
              telefone: veiculo.telefone || '',
              cidade: veiculo.cidade || '',
              status: 'ativo',
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }

          // Cria veículo único por placa+cpf
          const veiculoKey = `${cpf}_${veiculo.n_placa || veiculo.imei}`;
          const veiculoExistente = veiculosArray.find(v => v.key === veiculoKey);
          
          if (!veiculoExistente) {
            veiculosArray.push({
              key: veiculoKey,
              clienteCpf: cpf,
              clienteNome: veiculo.nome || '',
              placa: veiculo.n_placa || '',
              modelo: veiculo.veiculo || '',
              tipoVeiculo: detectarTipoVeiculo(veiculo.tp_veiculo || veiculo.veiculo || ''),
              imei: veiculo.imei || '',
              numeroSim: veiculo.numero_sim || '',
              equipamento: veiculo.equipamento || '',
              dataInstalacao: veiculo.data_Instalacao || '',
              valor: parseFloat(veiculo.valor) || 0,
              diaVencimento: parseInt(veiculo.vencimento) || 10,
              tipoAquisicao: veiculo.tipo_aquisicao || 'Comodato',
              obs: veiculo.obs || '',
              cidade: veiculo.cidade || '',
              statusVeiculo: 'ativo',
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }

          // Cria pagamento para este mês/ano
          pagamentosArray.push({
            clienteCpf: cpf,
            clienteNome: veiculo.nome || '',
            placa: veiculo.n_placa || '',
            modelo: veiculo.veiculo || '',
            ano: parseInt(ano),
            mes: parseInt(mesNumero),
            mesAno: mesAno,
            valor: parseFloat(veiculo.valor) || 0,
            valorPago: veiculo.situacao === 'PAGO' ? parseFloat(veiculo.valor) || 0 : 0,
            status: mapearStatus(veiculo.situacao),
            dataPagamento: veiculo.data_pagamento || null,
            diaVencimento: parseInt(veiculo.vencimento) || 10,
            obs: veiculo.obs || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }
  }

  console.log(`📊 Dados processados:`);
  console.log(`   - Clientes únicos: ${clientesMap.size}`);
  console.log(`   - Veículos únicos: ${veiculosArray.length}`);
  console.log(`   - Registros de pagamento: ${pagamentosArray.length}\n`);

  // Salva no Firestore
  const batch = firestore.batch();
  let batchCount = 0;
  const BATCH_LIMIT = 400;

  // Salva clientes
  console.log('💾 Salvando clientes...');
  for (const [cpf, cliente] of clientesMap) {
    const ref = firestore.collection('clientes').doc(cpf);
    batch.set(ref, cliente, { merge: true });
    batchCount++;
    
    if (batchCount >= BATCH_LIMIT) {
      await batch.commit();
      batchCount = 0;
    }
  }

  // Salva veículos
  console.log('💾 Salvando veículos...');
  for (const veiculo of veiculosArray) {
    const { key, ...veiculoData } = veiculo;
    const ref = firestore.collection('veiculos').doc();
    batch.set(ref, veiculoData);
    batchCount++;
    
    if (batchCount >= BATCH_LIMIT) {
      await batch.commit();
      batchCount = 0;
    }
  }

  // Salva pagamentos
  console.log('💾 Salvando pagamentos...');
  for (const pagamento of pagamentosArray) {
    const docId = `${pagamento.clienteCpf}_${pagamento.placa}_${pagamento.mesAno}`.replace(/[\/\s]/g, '_');
    const ref = firestore.collection('pagamentos').doc(docId);
    batch.set(ref, pagamento, { merge: true });
    batchCount++;
    
    if (batchCount >= BATCH_LIMIT) {
      await batch.commit();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log('\n✅ Migração concluída com sucesso!');
  process.exit(0);
}

function detectarTipoVeiculo(texto) {
  const t = (texto || '').toLowerCase();
  if (t.includes('moto') || t.includes('fan') || t.includes('biz') || t.includes('bros') || 
      t.includes('cg') || t.includes('pop') || t.includes('titan') || t.includes('factor') ||
      t.includes('fazer') || t.includes('xre') || t.includes('nmax') || t.includes('pcx')) {
    return 'moto';
  }
  if (t.includes('caminh') || t.includes('truck') || t.includes('cargo')) return 'caminhao';
  if (t.includes('van') || t.includes('fiorino') || t.includes('ducato')) return 'van';
  if (t.includes('trator')) return 'trator';
  if (t.includes('onibus') || t.includes('ônibus')) return 'onibus';
  if (t.includes('bicicleta') || t.includes('bike')) return 'bicicleta';
  return 'carro';
}

function mapearStatus(situacao) {
  const s = (situacao || '').toUpperCase();
  if (s === 'PAGO' || s === 'RECEBIDO') return 'PAGO';
  if (s === 'ATRASADO' || s === 'VENCIDO') return 'ATRASADO';
  return 'PENDENTE';
}

migrarDados().catch(console.error);

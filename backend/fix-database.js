// fix-database.js - Script para corrigir duplicatas e reorganizar dados
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Carrega o JSON original
const jsonPath = path.join(__dirname, '..', 'kmtracker-e1f30-default-rtdb-export.json');
const originalData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function fixDatabase() {
  console.log('🔧 Iniciando correção do banco de dados...\n');

  // 1. Limpar coleções existentes
  console.log('🗑️  Limpando coleções existentes...');
  await clearCollection('clientes');
  await clearCollection('veiculos');
  await clearCollection('pagamentos');
  
  // 2. Extrair clientes e veículos únicos do JSON original
  const { clientes, veiculos } = extractUniqueData(originalData);
  
  console.log(`\n📊 Dados extraídos:`);
  console.log(`   - ${clientes.size} clientes únicos`);
  console.log(`   - ${veiculos.size} veículos únicos\n`);

  // 3. Inserir clientes
  console.log('👥 Inserindo clientes...');
  const clienteIdMap = new Map(); // CPF -> Firestore ID
  
  for (const [cpf, cliente] of clientes) {
    const docRef = await db.collection('clientes').add({
      cpf: cpf,
      nome: cliente.nome,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      cidade: cliente.cidade || '',
      status: 'ativo',
      totalVeiculos: cliente.veiculosCount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    clienteIdMap.set(cpf, docRef.id);
    console.log(`   ✓ ${cliente.nome} (${cpf}) - ${cliente.veiculosCount} veículo(s)`);
  }

  // 4. Inserir veículos
  console.log('\n🚗 Inserindo veículos...');
  let veiculosInseridos = 0;
  
  for (const [key, veiculo] of veiculos) {
    const clienteId = clienteIdMap.get(veiculo.cpf);
    if (!clienteId) {
      console.log(`   ⚠️ Cliente não encontrado para veículo: ${veiculo.placa}`);
      continue;
    }

    const clienteData = clientes.get(veiculo.cpf);
    
    await db.collection('veiculos').add({
      clienteId: clienteId,
      clienteNome: clienteData?.nome || '',
      clienteCpf: veiculo.cpf,
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      tipoVeiculo: veiculo.tipoVeiculo,
      valor: parseFloat(veiculo.valor) || 45,
      diaVencimento: parseInt(veiculo.vencimento) || 10,
      dataInstalacao: veiculo.dataInstalacao || '',
      imei: veiculo.imei || '',
      numeroSim: veiculo.numeroSim || '',
      equipamento: veiculo.equipamento || '',
      tipoAquisicao: veiculo.tipoAquisicao || '',
      obs: veiculo.obs || '',
      status: 'ativo',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    veiculosInseridos++;
    console.log(`   ✓ ${veiculo.placa} - ${veiculo.modelo} (${clienteData?.nome})`);
  }

  console.log(`\n✅ Correção concluída!`);
  console.log(`   - ${clientes.size} clientes`);
  console.log(`   - ${veiculosInseridos} veículos`);
  
  process.exit(0);
}

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`   ✓ ${collectionName}: vazio`);
    return;
  }
  
  // Divide em chunks de 500
  const chunks = [];
  let chunk = [];
  
  snapshot.docs.forEach((doc, index) => {
    chunk.push(doc);
    if (chunk.length >= 400 || index === snapshot.docs.length - 1) {
      chunks.push(chunk);
      chunk = [];
    }
  });
  
  for (const chunkDocs of chunks) {
    const batch = db.batch();
    chunkDocs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
  
  console.log(`   ✓ ${collectionName}: ${snapshot.size} documentos removidos`);
}

function extractUniqueData(data) {
  const clientes = new Map(); // CPF -> dados do cliente
  const veiculos = new Map(); // placa/imei -> dados do veículo
  
  const clientesData = data.CLIENTES;
  
  // Itera por anos
  for (const [ano, meses] of Object.entries(clientesData)) {
    // Itera por meses
    for (const [mes, cpfs] of Object.entries(meses)) {
      // Itera por CPFs
      for (const [cpf, dadosCliente] of Object.entries(cpfs)) {
        if (!dadosCliente.DADOS_GERAL) continue;
        
        // Itera por veículos dentro de DADOS_GERAL
        for (const [veiculoKey, veiculo] of Object.entries(dadosCliente.DADOS_GERAL)) {
          // Normaliza CPF (remove caracteres especiais)
          const cpfNormalizado = (veiculo.cpf || cpf).replace(/\D/g, '');
          
          // Extrai/atualiza dados do cliente (pega os mais recentes)
          if (!clientes.has(cpfNormalizado)) {
            clientes.set(cpfNormalizado, {
              nome: (veiculo.nome || '').toUpperCase().trim(),
              email: (veiculo.email || '').toLowerCase().trim(),
              telefone: veiculo.telefone || '',
              cidade: veiculo.cidade || '',
              veiculosCount: 0
            });
          }
          
          // Usa placa OU imei como identificador único do veículo
          const placa = (veiculo.n_placa || '').toUpperCase().trim();
          const imei = veiculo.imei || '';
          const veiculoId = placa || imei;
          
          if (!veiculoId) continue;
          
          // Só adiciona se não existir (evita duplicatas)
          if (!veiculos.has(veiculoId)) {
            veiculos.set(veiculoId, {
              cpf: cpfNormalizado,
              placa: placa,
              modelo: (veiculo.veiculo || '').trim(),
              tipoVeiculo: normalizeTipoVeiculo(veiculo.tp_veiculo),
              valor: veiculo.valor || '45',
              vencimento: veiculo.vencimento || '10',
              dataInstalacao: veiculo.data_Instalacao || '',
              imei: imei,
              numeroSim: veiculo.numero_sim || '',
              equipamento: veiculo.equipamento || '',
              tipoAquisicao: veiculo.tipo_aquisicao || '',
              obs: veiculo.obs || ''
            });
            
            // Incrementa contador de veículos do cliente
            const cliente = clientes.get(cpfNormalizado);
            if (cliente) {
              cliente.veiculosCount++;
            }
          }
        }
      }
    }
  }
  
  return { clientes, veiculos };
}

function normalizeTipoVeiculo(tipo) {
  if (!tipo) return 'carro';
  const t = tipo.toLowerCase().trim();
  
  if (t.includes('moto') || t.includes('motocicleta')) return 'moto';
  if (t.includes('caminh')) return 'caminhao';
  if (t.includes('van')) return 'van';
  if (t.includes('trator')) return 'trator';
  if (t.includes('onibus') || t.includes('ônibus')) return 'onibus';
  
  return 'carro';
}

// Executa
fixDatabase().catch(console.error);

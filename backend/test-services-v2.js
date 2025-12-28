// test-services-v2.js - Testa os novos serviços do Firestore
import dotenv from 'dotenv';
dotenv.config();

import clienteService from './src/services/clienteServiceV2.js';
import veiculoService from './src/services/veiculoServiceV2.js';
import pagamentoService from './src/services/pagamentoServiceV2.js';
import authService from './src/services/authServiceV2.js';

async function testar() {
  console.log('\n════════════════════════════════════════════════════');
  console.log('     🧪 TESTANDO SERVIÇOS V2 (FIRESTORE)');
  console.log('════════════════════════════════════════════════════\n');

  try {
    // ═══════════════════════════════════════════════════════
    // TESTE 1: Clientes
    // ═══════════════════════════════════════════════════════
    console.log('📋 CLIENTES:');
    
    const clientes = await clienteService.listar({ limite: 5 });
    console.log(`   ✅ Listagem: ${clientes.total} clientes (limite 5)`);
    
    if (clientes.clientes.length > 0) {
      const primeiroCliente = clientes.clientes[0];
      console.log(`   ✅ Primeiro: ${primeiroCliente.nome} (CPF: ${primeiroCliente.cpf})`);
      
      const buscaCpf = await clienteService.obterPorCpf(primeiroCliente.cpf);
      console.log(`   ✅ Busca por CPF: ${buscaCpf.cliente.nome}`);
    }
    
    const busca = await clienteService.buscar('ISMAEL');
    console.log(`   ✅ Busca "ISMAEL": ${busca.total} resultados`);
    
    const stats = await clienteService.obterEstatisticas();
    console.log(`   ✅ Estatísticas: ${stats.estatisticas.totalClientes} clientes, ${stats.estatisticas.totalVeiculos} veículos`);
    
    // ═══════════════════════════════════════════════════════
    // TESTE 2: Veículos
    // ═══════════════════════════════════════════════════════
    console.log('\n🚗 VEÍCULOS:');
    
    const veiculos = await veiculoService.listar({ limite: 5 });
    console.log(`   ✅ Listagem: ${veiculos.total} veículos (limite 5)`);
    
    if (veiculos.veiculos.length > 0) {
      const primeiroVeiculo = veiculos.veiculos[0];
      console.log(`   ✅ Primeiro: ${primeiroVeiculo.placa} - ${primeiroVeiculo.modelo}`);
      
      const buscaPlaca = await veiculoService.obterPorPlaca(primeiroVeiculo.placa);
      console.log(`   ✅ Busca por placa: ${buscaPlaca.veiculo.modelo}`);
    }
    
    const veiculosStats = await veiculoService.obterEstatisticas();
    console.log(`   ✅ Estatísticas: ${veiculosStats.estatisticas.total} total, ${veiculosStats.estatisticas.pagos} pagos`);
    
    // ═══════════════════════════════════════════════════════
    // TESTE 3: Pagamentos
    // ═══════════════════════════════════════════════════════
    console.log('\n💰 PAGAMENTOS:');
    
    const pagamentos = await pagamentoService.listarMesAtual();
    console.log(`   ✅ Mês atual (${pagamentos.mesAno}): ${pagamentos.total} pagamentos`);
    
    const resumo = await pagamentoService.obterResumoMes();
    console.log(`   ✅ Resumo: R$ ${resumo.resumo.totalValor.toFixed(2)} a receber, R$ ${resumo.resumo.totalPago.toFixed(2)} recebido`);
    console.log(`   ✅ Status: ${resumo.resumo.pagos} pagos, ${resumo.resumo.pendentes} pendentes, ${resumo.resumo.atrasados} atrasados`);
    
    // ═══════════════════════════════════════════════════════
    // TESTE 4: Auth
    // ═══════════════════════════════════════════════════════
    console.log('\n👤 AUTENTICAÇÃO:');
    
    const usuarios = await authService.listarUsuarios();
    console.log(`   ✅ Usuários cadastrados: ${usuarios.total}`);
    usuarios.usuarios.forEach(u => {
      console.log(`      - ${u.nome} (${u.role})`);
    });

    // ═══════════════════════════════════════════════════════
    // RESULTADO
    // ═══════════════════════════════════════════════════════
    console.log('\n════════════════════════════════════════════════════');
    console.log('        ✅ TODOS OS TESTES PASSARAM!');
    console.log('════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ ERRO no teste:', error.message);
    console.error(error);
  }

  process.exit(0);
}

testar();

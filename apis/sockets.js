const express = require('express');
const router = express.Router();
const socketIO = require('socket.io');
const admin = require('firebase-admin');
const db = admin.database();

const moment = require('moment');
require('moment-timezone');
moment.locale('pt-br'); // Configurar para o idioma português brasileiro


function initializeSocketServer(httpServer) {

  const app = express(); // Adicione esta linha
  app.use(express.static('build')); // Adicione esta linha
  let io = socketIO(httpServer, {
    cors: {
      origin: "*",
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    }
  });
  io.on('connection', async (socket) => {
    const user = socket.handshake.query.userSocket;
    console.log('A user connected - ' + socket.id + ' - ' + user);
    
    socket.on('disconnect', () => {
      console.log('Cliente desconectado: ', socket.id + ' - ' + user);

    });

    await buscarDadosIniciais(socket)
    
return socket;
});
  
}

const primeiroDds = async(result)=>{
    try {
        let json01 = {}
    json01['totais_cliente'] = 0
    json01['pagamento_pendente'] = 0
    json01['pagamento_atrasado'] = 0
    json01['pago'] = 0
    Object.keys(result).forEach(cpf => {
        json01['totais_cliente']  = parseInt(json01['totais_cliente'])+1
        Object.keys(result[cpf]['DADOS_GERAL']).forEach(Id => {
            if(result[cpf]['DADOS_GERAL'][Id]['situacao'] === 'PAGO'){
                json01['pago'] = parseInt(json01['pago'])
                + parseInt(result[cpf]['DADOS_GERAL'][Id]['valor'])
            }else{
                if(!json01['valorTotal']){
                    json01['valorTotal'] = 0
                }
                json01['valorTotal'] = parseInt(json01['valorTotal'])
                + parseInt(result[cpf]['DADOS_GERAL'][Id]['valor'])
            }
            if(result[cpf]['DADOS_GERAL'][Id]['situacao'] === 'PENDENTE'){
                json01['pagamento_pendente'] = parseInt(json01['pagamento_pendente'])+1
            }
            if(result[cpf]['DADOS_GERAL'][Id]['situacao'] === 'ATRASADO'){
                json01['pagamento_atrasado'] = parseInt(json01['pagamento_atrasado'])+1
            }
        });
    });
    return json01
    } catch (error) {
        console.log(error)
    }
    
    
}

const segundoDs = async (result) =>{
    try {
        let json = {}
    Object.keys(result).forEach(cpf =>{
        let qtdVeiculo = 0
        Object.keys(result[cpf]['DADOS_GERAL']).forEach(Id => {
            let nomeCliente = result[cpf]['DADOS_GERAL'][Id]['nome']
            if (!json[nomeCliente]){
                json[nomeCliente] = {
                    valortotal_devedor:0,
                    dataPagamento:'',
                    qtdVeiculo:0,
                    cpf:cpf
                }
            }
                let valor = parseInt(result[cpf]['DADOS_GERAL'][Id]['valor']);
                let dataPagemto = result[cpf]['DADOS_GERAL'][Id]['vencimento']
                let dta = moment().tz('America/Sao_Paulo').format('MM-YYYY')
                dataPagemto = dataPagemto + '-' + dta
                 qtdVeiculo += 1
                json[nomeCliente] = {
                    valortotal_devedor:parseInt(json[nomeCliente]['valortotal_devedor']+valor),
                    dataPagamento:dataPagemto,
                    qtdVeiculo:qtdVeiculo,
                    cpf:cpf,
                    situacao:result[cpf]['DADOS_GERAL'][Id]['situacao']
                }
            
        }) 
    });
    return json
    } catch (error) {
        console.log(error)
    }
    

    
}

const buscarDadosIniciais = async (socket)=>{
    try {
        const ano = moment().tz('America/Sao_Paulo').format('YYYY')
        const mes = moment().tz('America/Sao_Paulo').format('MMMM')
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes)
        dbDados.on('value', async (result)=>{
            result = await result.val()
            const primeiroDados = await primeiroDds(result)
            primeiroDados['mes'] = mes
            primeiroDados['ano'] = ano 
            const segundoDados = await segundoDs(result)
            const json = {
                primeiroDados:primeiroDados,
                sugundoDados:segundoDados
            }
         
            socket.emit('dadosInicial',json)
        })
        
    } catch (error) {
       console.log(error) 
    }
}



module.exports = initializeSocketServer;
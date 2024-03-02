const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const app = express();
const moment = require('moment');
require('moment-timezone');
moment.locale('pt-br');
// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Firebase
const db = admin.database();

const keySecret = "$%9086Mtk6577#$%%%9086"

async function criarToken(user) {
    return jwt.sign({ user }, keySecret);
}

router.post('/auth',async (req,res)=>{
    try {
        const user = req.body.usuario;
        const senha = req.body.senha;
        console.log(user + ' - ' + senha)

        if (user === '' || senha === ''){
            throw new Error('2')
        }

        const dbDados = db.ref('/USUARIO/'+user)
        let result = await dbDados.once('value');
        result = await result.val()

        if(!result){
            throw new Error('1')
        }
        if(result['SENHA'].toString()!== senha){
            throw new Error('2')
        }
        const token = await criarToken(user)
        const json = {
            token:token
        }
        res.json(json)

    } catch (error) {
        if(error.message === '1'){
            res.status(401).send('Usuario não cadastrado!')
            return
        }else if(error.message === '2'){
            res.status(401).send('Usuario ou senha incorreto, incapaz de continuar!')
        }else{
            res.status(401).send('Houve uma falha ao realizar login!')
        }
        
    }
})

router.post('/registrarCliente',async (req,res)=>{
    try {
        const dados = req.body
        Object.keys(dados).forEach(value =>{
            if (dados[value] === ''){
                throw new Error('Você deve preenchser todos os dados')
            }
        });

        await registrarCliente(dados)
        res.send('Novo cliente registrado com sucesso')
    } catch (error) {
        
        res.status(404).send(error.message)
        console.log(error.message)
    }
});

const registrarCliente = async (dados)=>{
    try {
        const cpf = dados.cpf
        const ano = moment().tz('America/Sao_Paulo').format('YYYY')
        const mes = moment().tz('America/Sao_Paulo').format('MMMM')
        dados['situacao'] = 'PENDENTE'
        dados['data_pagamento'] = ''
        dados['status'] = ''
        dados.data_Instalacao = moment(dados.data_Instalacao).format('DD-MM-YYYY')
        const dbRegistro = db.ref('/CLIENTES/'+ ano + '/'+ mes + '/' +cpf+'/DADOS_GERAL')
        dbRegistro.push(dados)
    } catch (error) {
        console.log(error)
    }
}

router.post('/configCliente',async (req,res)=>{
    try {
        const cpf = req.body.id
        const ano = moment().tz('America/Sao_Paulo').format('YYYY')
        const mes = moment().tz('America/Sao_Paulo').format('MMMM')
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes+'/'+cpf)
        let result = await dbDados.once('value');
        result = await result.val();
        const configurarDados = await configDados(result)


        res.json(configurarDados)
    } catch (error) {
        console.log('error config')
        console.log(error);
        
    }
})

const configDados = async (result)=>{
    try {
        let nvJson = {}
        nvJson['cliente']={}
        nvJson['situacao']={}
        nvJson['cpf']={}
        nvJson['cliente']={}
        nvJson['nome']={}
        nvJson['valor']=0
        nvJson['vencimento']={}
        let vencimento = 0
        Object.keys(result['DADOS_GERAL']).forEach(chave =>{
            const nome = result['DADOS_GERAL'][chave]['nome']
            if(!nvJson['cliente'][nome]){
                nvJson['cliente'][nome]={}
            }
            nvJson['nome']=nome
            nvJson['situacao'] = result['DADOS_GERAL'][chave]['situacao'],
            nvJson['cpf'] = result['DADOS_GERAL'][chave]['cpf'],
            nvJson['cliente'][nome][chave] = {
                veiculo:result['DADOS_GERAL'][chave]['veiculo'],
                placa:result['DADOS_GERAL'][chave]['n_placa'],
                imei:result['DADOS_GERAL'][chave]['imei'],
                Sim:result['DADOS_GERAL'][chave]['numero_sim'],
                equip:result['DADOS_GERAL'][chave]['equipamento'],
                Observacao:result['DADOS_GERAL'][chave]['obs'],
                tipo_Veiculo:result['DADOS_GERAL'][chave]['tp_veiculo'],
                chaveKey:chave
                
            }
            vencimento = result['DADOS_GERAL'][chave]['vencimento']
             
            nvJson['valor'] = parseInt(nvJson['valor'])+parseInt(result['DADOS_GERAL'][chave]['valor'])
        });
        vencimento =vencimento + '-' + moment().tz('America/Sao_Paulo').format('MMM-YYYY');
        nvJson['vencimento'] = vencimento
        return nvJson
    } catch (error) {
        console.log(error);
    }
}

router.post('/confirmarPagamento', async (req,res)=>{
    try {
        const cpf = req.body.cpf
        const ano = moment().tz('America/Sao_Paulo').format('YYYY')
        const mes = moment().tz('America/Sao_Paulo').format('MMMM')
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes+'/'+cpf+'/'+'DADOS_GERAL')
        let result = await dbDados.once('value');
        result = await result.val();
        Object.keys(result).forEach(Id=>{
           result[Id]['situacao']='PAGO' 
        })
        dbDados.update(result)
        res.status(200).send('Pagamento foi adicionado como efetuado!')
    } catch (error) {
        res.status(500).send('Houve um erro ao registrar os dados!')
        console.log(error)
    };
});

router.post('/addpendente', async (req,res)=>{
    try {
        const cpf = req.body.cpf
        const ano = moment().tz('America/Sao_Paulo').format('YYYY')
        const mes = moment().tz('America/Sao_Paulo').format('MMMM')
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes+'/'+cpf+'/'+'DADOS_GERAL')
        let result = await dbDados.once('value');
        result = await result.val();
        Object.keys(result).forEach(Id=>{
           result[Id]['situacao']='PENDENTE' 
        })
        dbDados.update(result)
        res.status(200).send('Pagamento foi adicionado com pendente!')
    } catch (error) {
        res.status(500).send('Houve um erro ao registrar os dados!')
        console.log(error)
    };
});

setInterval(() => {
    verificarMes()
}, 18000000);
// 18000000 5 hocas
setInterval(() => {
    verificarSeatrasado()
}, 24000000);
const verificarSeatrasado = async () => {
    try {
        const mes = moment().tz('America/Sao_Paulo').format('MMMM');       
        const ano = moment().tz('America/Sao_Paulo').format('YYYY');
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes);
        let resultAnteorio = await dbDados.once('value');
        resultAnteorio = await resultAnteorio.val()
        if(!resultAnteorio){
            console.warn('não ha dados ainda')
            return
        }
        const dataAtual = moment().tz('America/Sao_Paulo');

        Object.keys(resultAnteorio).forEach(cpf => {
            Object.keys(resultAnteorio[cpf]['DADOS_GERAL']).forEach(chave => {
                const situacao = resultAnteorio[cpf]['DADOS_GERAL'][chave]['situacao']
                const diaVencimento = resultAnteorio[cpf]['DADOS_GERAL'][chave]['vencimento']
                const data = diaVencimento+'-'+moment().tz('America/Sao_Paulo').format('MM-YYYY')
                const dataComparacao = moment(data, 'DD-MM-YYYY').tz('America/Sao_Paulo');
                if (dataAtual.isAfter(dataComparacao) && situacao !=='PAGO') {
                    resultAnteorio[cpf]['DADOS_GERAL'][chave]['situacao']='ATRASADO'
                }
            });
        });

        dbDados.update(resultAnteorio)
    } catch (error) {
        console.log(error)
    }
}

const verificarMes = async ()=>{
    try {
        const mes = moment().tz('America/Sao_Paulo').format('MMMM');       
        const ano = moment().tz('America/Sao_Paulo').format('YYYY');
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes);
        let result = await dbDados.once('value')
        result = await result.val()
        if(result){
            console.warn('NÃO MODIFIQUE NADA NO MOEMTN')
            return
        };
        let numMes = parseInt(moment().tz('America/Sao_Paulo').format('MM'));
        let numano = parseInt(moment().tz('America/Sao_Paulo').format('YYYY'));
        if (numano !== parseInt(ano)){
            numano = parseInt(ano)-1
        }
        numMes = parseInt(numMes)-1
        if(parseInt(numMes) < 1){
            numMes = 12
        }
 
        const diaFormat = '01-'+numMes+'-'+numano
        numMes = moment(diaFormat, 'DD-MM-YYYY').format('MMMM');
        console.log(numMes + ' - ' + numano)
       
        const dbDadosAnteriror = db.ref('/CLIENTES/'+numano+'/'+numMes);
        let resultAnteorio = await dbDadosAnteriror.once('value')
        resultAnteorio = await resultAnteorio.val()
        Object.keys(resultAnteorio).forEach(cpf => {
            Object.keys(resultAnteorio[cpf]['DADOS_GERAL']).forEach(chave => {
                resultAnteorio[cpf]['DADOS_GERAL'][chave]['situacao']='PENDENTE'
            })
        });

        dbDados.set(resultAnteorio)
    } catch (error) {
        console.log(error)
    }
};


router.post('/excluirVeiculo',async (req,res)=>{
    try {
        const cpf = req.body.cpf
        const key = req.body.key
        console.log(key + ' -  ' + cpf)
        const mes = moment().tz('America/Sao_Paulo').format('MMMM');       
        const ano = moment().tz('America/Sao_Paulo').format('YYYY');
        const dbDados = db.ref('/CLIENTES/'+ano+'/'+mes+'/'+cpf+'/DADOS_GERAL/'+key);
        let result = await dbDados.once('value')
        result = await result.val()
        if(!result){
            throw new Error("1")
        }
        await dbDados.remove()
        res.status(200).send('Veículo excluido com suceso!')
    } catch (error) {
        if (error.message === '1'){
            res.status(401).send('Este veiculo não foi encontrado!')
        }else{
            res.status(401).send('houve um erro ao excluir os dados!, tente novamente')
        }
    }
})
module.exports = router;
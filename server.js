const express = require('express');
const app = express();
const cors = require('cors'); 
var admin = require("firebase-admin");
var serviceAccount = require('./serviceAccountKey.json');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const path = require('path');
require('moment-timezone');
const http = require('http');
moment.locale('pt-br');
/* 'http://localhost:3000','http://192.168.1.6:3005','http://192.168.1.6:3000', */
const corsOptions = {
  origin: ['https://kmtraker.store','https://www.kmtraker.store','https://kmtracker.connecct.net','https://dev4785.d3t9dp7xqhnxhi.amplifyapp.com'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true,
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kmtracker-e1f30-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const server = http.createServer(app);
let io
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});


app.use('/', async (req, res, next) => {
      try {
        const origi = req.originalUrl

        const user = req.cookies.usuario;
        console.log('O usuario do cookies é: ' + user)

        if(origi === '/AddCliente/auth'){
          next()
          return
        }
        if(origi !== '/AddCliente/auth' && typeof user ==='undefined'){
          console.log('usuario sem cookies')
          throw new Error('1')
        }else{
          next()
        }

      } catch (error) {
        if (error.message === '1'){
          res.status(408).send('Faça login novamente para continuar!')
        }
      }
  

});


// Configurar middleware para todas as outras rotas
app.use(express.static(path.join(__dirname, './frend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frend/build/index.html'));
});





const port = process.env.PORT || 3005;
server.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});

const loginServer = require('./serverAddCliente/ServerAddCliente');




app.use('/AddCliente',loginServer)
const socketServer = require('./apis/sockets');

socketServer(server);
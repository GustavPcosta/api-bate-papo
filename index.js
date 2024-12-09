const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Server } = require('socket.io');
const routes = require('./routes/routes');
const db = require('./bd/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});


app.use(cors());
app.use(express.json());


app.use('/api', routes); 


app.get('/', (req, res) => {
  res.send('API funcionando!');
});


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'secretKey');
    return decoded;
  } catch (err) {
    return null;
  }
};


io.on('connection', (socket) => {
  const token = socket.handshake.query.token;
  const decoded = verifyToken(token);

  if (!decoded) {
    console.log('Token inválido ou expirado. Desconectando socket.');
    socket.emit('auth_error', { message: 'Token inválido ou expirado' });
    socket.disconnect();
    return;
  }

  console.log(`Usuário autenticado: ${decoded.username} - ID do socket: ${socket.id}`);

  socket.on('join_room', (data) => {
    const { room, username } = data;
    if (room && username) {
      socket.join(room);
      console.log(`Usuário ${username} (socket ID: ${socket.id}) entrou na sala: ${room}`);
      socket.emit('welcome', `Bem-vindo à sala ${room}, ${username}!`);
    } else {
      console.log('Tentativa de entrar em uma sala sem nome ou username.');
    }
  });

  socket.on('send_message', async (data) => {
    const { content, room, sender } = data;

    if (!content || !room || !sender) {
      console.error('Dados inválidos recebidos para send_message:', data);
      socket.emit('error', { message: 'Mensagem incompleta' });
      return;
    }

    try {
      await db('messages').insert({ content, room, sender });
      io.to(room).emit('receive_message', data);
      console.log(`Mensagem enviada para a sala ${room}:`, data);
    } catch (error) {
      console.error('Erro ao salvar mensagem no banco:', error);
      socket.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${decoded.username} - ID do socket: ${socket.id}`);
  });
});


if (process.env.VERCEL_ENV) {
  module.exports = app; 
} else {
  server.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
  });
}

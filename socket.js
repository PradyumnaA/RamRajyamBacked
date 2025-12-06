const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },  
  });

  io.on('connection', (socket) => {
    console.log('New Client Connected', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  return io;
};

const emitNotification = (userId, message) => {
  if (io) {
    io.to(userId).emit('newJobNotification', { message });
  }
};

module.exports = { initializeSocket, emitNotification, getIo: () => io };

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.UserInfo.email;
      socket.userRole = decoded.UserInfo.roles;
      next();
    });
  });

  io.on('connection', (socket) => {
    // console.log(`User connected: ${socket.userId}`);

    socket.on('join-shipment', (shipmentId) => {
      socket.join(`shipment-${shipmentId}`);
    });

    socket.on('leave-shipment', (shipmentId) => {
      socket.leave(`shipment-${shipmentId}`);
    });

    socket.on('join-user-room', (userId) => {
      socket.join(`user-${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };

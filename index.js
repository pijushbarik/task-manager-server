const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const http = require('http');
const { Server: SocketServer } = require('socket.io');
const socketController = require('./controllers/socket');

const server = http.createServer(app);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', socketController);

  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

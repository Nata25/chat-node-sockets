/* Node core */
import http from 'http';

/* Dependencies */
import express from 'express';
import { Server } from 'socket.io';
import Filter from 'bad-words';

import { generateMessage } from './utils/generate-message.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:9500',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', function(socket) {
  // emit to a new user
  socket.emit('message', generateMessage('Welcome!'));

  // emit to all but this particular user
  socket.broadcast.emit('message', 'New user has joined!');

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      callback('Profanity is not allowed!');
      return;
    }
    callback();
    // emit to everybody
    io.emit('message', generateMessage(message));
  });

  // notify everybody when user leaves
  // NOTE: this runs also on page reload
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });

  socket.on('sendLocation', ({ lat, lng }, callback) => {
    io.emit('locationMessage', generateMessage(`https://google.com/maps?q=${lat},${lng}`));
    callback();
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT);
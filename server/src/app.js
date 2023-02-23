import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import Filter from 'bad-words';
import serveStatic from 'serve-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', function(socket) {
  // emit to a new user
  socket.emit('message', 'Welcome!');

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
    io.emit('message', message);
  });

  // notify everybody when user leaves
  // NOTE: this runs also on page reload
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });

  socket.on('sendLocation', ({ lat, lng }, callback) => {
    io.emit('locationMessage', `https://google.com/maps?q=${lat},${lng}`);
    callback();
  });
});

const PORT = process.env.PORT || 3000;
app.use(serveStatic(path.join(__dirname, '../public')));

server.listen(PORT);

import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import Filter from 'bad-words';
import serveStatic from 'serve-static';

import { generateMessage } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Username placeholders
const ADMIN = '[Admin]';

io.on('connection', function(socket) {

  socket.on('join', ({ userName, room }, callback) => {
    // store user and get user data back
    const { error, user } = addUser({ id: socket.id, userName, room });
    if (error) {
      callback(error);
      return;
    }

    socket.join(room);

    // emit to a new user
    socket.emit('message', {
      userName: ADMIN,
      ...generateMessage(`Welcome, ${user.userName}!`),
    });

    // emit to all users in a room except for this particular user
    socket.broadcast.to(room).emit('message', {
      userName: ADMIN,
      ...generateMessage(`${userName} has joined!`),
    });

    // emit room data to client when users list in a room changes
    io.to(room).emit('roomData', {
      users: getUsersInRoom(room),
      room,
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      callback('Profanity is not allowed!');
      return;
    }
    const user = getUser(socket.id);
    if (user) {
      // emit to everybody in a specific room
      io.to(user.room).emit('message', {
        userId: socket.id,
        userName: user.userName,
        ...generateMessage(message),
      });
      callback();
    }
  });

  // notify everybody when user leaves
  // NOTE: this runs also on page reload
  socket.on('disconnect', () => {
    const { user } = removeUser(socket.id);
    if (user) {
      const { room, userName } = user;
      io.to(room).emit('message', {
        userName: ADMIN,
        ...generateMessage(`${userName} has left!`),
      });

      // emit room data to client when users list in a room changes
      io.to(room).emit('roomData', {
        users: getUsersInRoom(room),
        room
      });
    }
  });

  socket.on('sendLocation', ({ lat, lng }, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('locationMessage', {
        userId: socket.id,
        userName: user.userName,
        ...generateMessage(`https://google.com/maps?q=${lat},${lng}`),
      });
      callback();
    }
  });
});

const PORT = process.env.PORT || 3000;
app.use(serveStatic(path.join(__dirname, '../public')));

server.listen(PORT);

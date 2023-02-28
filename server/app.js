/* Node core */
import http from 'http';

/* Dependencies */
import express from 'express';
import { Server } from 'socket.io';
import Filter from 'bad-words';

/* Helpers */
import { generateMessage } from './utils/generate-message.js';
import { addUser, getUser, getUsersInRoom, removeUser } from './utils/users.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:9500',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', function(socket) {
  socket.on('join', ({ userName, room }, callback) => {
    // store user and get user data back
    const { error, user } = addUser({ id: socket.id, userName, room });
    if (error) {
      callback({ error, user: null });
      return;
    }

    socket.join(room);

    // emit to a new user
    socket.emit('message', {
      isSystem: true,
      ...generateMessage(`Welcome, ${user.userName}!`),
    });

    // emit to all but this particular user
    socket.broadcast.to(room).emit('message', {
      isSystem: true,
      ...generateMessage(`${userName} has joined!`),
    });

    // emit room data to client when users list in a room changes
    io.to(room).emit('roomData', {
      users: getUsersInRoom(room),
      room,
    });

    callback({ user });
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
        userId: user.id,
        userName: user.userName,
        ...generateMessage(message),
      });
      callback();
    }
  });

  const disconnectUser = (socket) => {
    const { user } = removeUser(socket.id);
    if (user) {
      const { room, userName } = user;
      io.to(room).emit('message', {
        isSystem: true,
        ...generateMessage(`${userName} has left!`),
      });

      // emit room data to client when users list in a room changes
      io.to(room).emit('roomData', {
        users: getUsersInRoom(room),
        room,
      });
    }
  }

  // notify everybody in the room when user leaves
  // NOTE: this runs also on page reload
  socket.on('disconnect', () => {
    disconnectUser(socket);
  });

  // custom event is still needed as disconnect doesn't fire on routing from page
  socket.on('leaveRoom', ({ userName, room }) => {
    socket.leave(room);
    disconnectUser(socket);
  });

  socket.on('sendLocation', ({ lat, lng }, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('locationMessage', {
        userId: user.id,
        userName: user.userName,
        ...generateMessage(`https://google.com/maps?q=${lat},${lng}`),
      });
      callback();
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT);

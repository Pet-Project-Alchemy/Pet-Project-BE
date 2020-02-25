// moved functionality of this file to FE Chat.js

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// const users = [];

// const addUser = ({ id, username, room }) => {
//   username = username.trim().toLowerCase();
//   room = room.trim().toLowerCase();
//   if(!username || !room) {
//     return {
//       error: 'Username and room are required!'
//     };
//   }
//   const existingUser = users.find(() => {
//     return (username.room === room && username.username === username);
//   });
//   if(existingUser) {
//     return {
//       error: 'Username is in use!'
//     };
//   }

//   const user = { id, username, room };
//   users.push(user);
//   return { user };
// };

// const removeUser = (id) => {
//   const index = users.findIndex((user) => user.id === id);
//   if(index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// };

// const getUser = (id) => {
//   return users.find((user) => user.id === id);
// };

// const getUsersInRoom = (room) => {
//   return users.filter((user) => user.room === room);
// };

// module.exports = {
//   addUser,
//   removeUser,
//   getUser,
//   getUsersInRoom
// };



io.on('connection', (socket) => {
  socket.on('hi', (data) => {
    console.log(data);
  });
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if(error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`));

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed.');
    }
    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage',
      generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    callback();
  });

  socket.on('disconnect', () => {

    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

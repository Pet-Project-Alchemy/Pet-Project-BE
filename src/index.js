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

io.on('connection', (socket) => {
  console.log('New Websocket Connection');

  socket.on('join', ({ username, room }) => {
    //events only to specific  io.to.emit emits event to all in specific room \ socket.broadcast.to.emit
    socket.join(room);

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined.`));
  });

  socket.on('sendMessage', (message, callback) => {

    const filter = new Filter();

    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed.');
    }
    io.to('sd').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage',
      generateLocationMessage((`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

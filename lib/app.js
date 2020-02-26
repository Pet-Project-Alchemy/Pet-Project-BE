const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const cookieparser = require('cookie-parser');
const Message = require('./models/Message');
app.use(require('cors')({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieparser());
//app.use(require('cookie-parser')());
// app.use('/api/v1/RESOURCE', require('./routes/resource'));

app.use('/api/v1/auth', require('./routes/user'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

io.on('connection', (socket) => {
  let roomName = null;
  socket.on('join', ({ senderId, receiverId }) => {
    socket.senderId = senderId;
    socket.receiverId = receiverId;
    if(senderId < receiverId) {
      roomName = `${senderId}-${receiverId}`; 
    } else {
      roomName = `${receiverId}-${senderId}`;
    }
    Message
      .create ({ 
        senderId: socket.senderId, 
        receiverId: socket.receiverId, 
        text: `${senderId.username} has joined.`
      })
      .then(message => {
        socket.broadcast.to(roomName).emit('message', message);
      });
  });

  socket.on('sendMessage', (text) => {
    console.log('recieved message BE', text);
    Message
      .create({
        senderId: socket.senderId, 
        receiverId: socket.receiverId, 
        text
      })
      .then (message => {

        io.to(roomName).emit('message', message);

      });

  });

  socket.on('sendLocation', (coords) => {
    Message
      .create({
        senderId: socket.senderId, 
        receiverId: socket.receiverId, 
        url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      })
      .then (message => {

        io.to(roomName).emit('message', message);

      });
  });

  socket.on('disconnect', () => {
    Message
      .create({
        senderId: socket.senderId, 
        receiverId: socket.receiverId, 
        text: `Admin: ${socket.id} has left.`
      })
      .then (message => {

        io.to(roomName).emit('message', message);
      });
  });

});

module.exports = server;

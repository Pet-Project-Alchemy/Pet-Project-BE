const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const cookieparser = require('cookie-parser');
const Message = require('./models/Message');
const User = require('../lib/models/User');
app.use(require('cors')({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieparser());

app.use('/api/v1/auth', require('./routes/user'));
app.use('/api/v1/messages', require('./routes/messages'));
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

io.on('connection', (socket) => {
  let roomName = null;
  socket.on('join', async({ senderId, receiverId }) => {
    socket.sender = await User.findById(senderId);
    socket.receiver = await User.findById(receiverId);
    if(senderId < receiverId) {
      roomName = `${senderId}-${receiverId}`; 
    } else {
      roomName = `${receiverId}-${senderId}`;
    }
    socket.join(roomName);
    Message
      .create ({ 
        senderId: senderId, 
        receiverId: receiverId, 
        text: `${socket.sender.firstName} has joined.`
      })
      .then(message => {
        io.to(roomName).emit('message', message);
        return Message.find({ $or: [
          { senderId, receiverId }, 
          { senderId: receiverId, receiverId: senderId }
        ] });
      })
      .then(messages => {
        socket.emit('messages', messages);
      });
  });

  socket.on('sendMessage', (text) => {
    Message
      .create({
        senderId: socket.sender._id, 
        receiverId: socket.receiver._id, 
        text
      })
      .then (message => {
        io.to(roomName).emit('message', message);
      });
  });

  socket.on('sendLocation', (coords) => {
    Message
      .create({
        senderId: socket.sender._id, 
        receiverId: socket.receiver._id, 
        url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      })
      .then (message => {
        io.to(roomName).emit('message', message);
      });
  });

  socket.on('disconnect', () => {
    if(!socket.sender) return;
    Message
      .create({
        senderId: socket.sender._id, 
        receiverId: socket.receiver._id, 
        text: `Admin: ${socket.sender.firstName} has left.`
      })
      .then (message => {
        io.to(roomName).emit('message', message);
      });
  });
});

module.exports = server;

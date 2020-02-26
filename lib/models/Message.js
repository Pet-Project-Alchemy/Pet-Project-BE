const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', schema);

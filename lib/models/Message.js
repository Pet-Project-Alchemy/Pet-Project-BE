const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

schema.statics.conversation = function(userId) {
  return this.aggregate(
    [
      {
        '$match': {
          '$or': [
            {
              'senderId': userId
            }, {
              'receiverId': userId
            }
          ]
        }
      }, {
        '$group': {
          '_id': null, 
          'users': {
            '$addToSet': '$receiverId'
          }
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'users', 
          'foreignField': '_id', 
          'as': 'populated'
        }
      }
    ]
  )
    .then(([agg]) => {
      return agg.populated;
    });
};

module.exports = mongoose.model('Message', schema);

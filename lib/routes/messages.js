const { Router } = require('express');
const Message = require('../models/Message');
const ensureAuth = require('../middleware/ensure-auth');



module.exports = Router()

  .get('/', ensureAuth, (req, res, next) => {
    Message
      .conversation(req.user._id)
      .then(messages => res.send(messages))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const  { id }  = req.params;
    Message
      .find({ receiverId: id }) 
      //receiverId or senderId depending on how the front end fetches 
      .then(messages => res.send(messages))
      .catch(next);
  });

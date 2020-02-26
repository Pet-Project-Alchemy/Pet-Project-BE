const { Router } = require('express');
const Messages = require('../models/Message');
const ensureAuth = require('../middleware/ensure-auth');



module.exports = Router()

//   .get('/:id', (req, res, next) => {
   
//     Messages
//       .find(req.params.receiverId)
//       .then(messages => res.send(messages))
//       .catch(next);
//   });

  .get('/:id', (req, res, next) => {
    const  { id }  = req.params;
    Message
      .find({ receiverId: id }) 
      //receiverId or senderId depending on how the front end fetches 
      .then(messages => res.send(messages))
      .catch(next);
  })
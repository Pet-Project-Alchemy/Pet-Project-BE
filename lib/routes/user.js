const { Router } = require('mongoose');
import User from '../models/User';

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => res.send(user))
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .then(user => res.send(user))
      .catch(next);
  });

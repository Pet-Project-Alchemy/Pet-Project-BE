const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = (res, token) => {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });
};
const DeleteSessionCookie = (req) => {
  req.cookie('session', '', -1);
};


module.exports = Router()

  .post('/signup', (req, res, next) => {
    User.create(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authorize(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/logout', (req, res) => {
    res.clearCookie('session')
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  })

  .get('/zipcode/:zipcode', (req, res, next) => {
    const  { zipcode }  = req.params;
    User
      .find({ 'address.zipcode':  zipcode  })
      .then(users => res.send(users))
      .catch(next);
  });



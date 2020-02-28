const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');
const profileImgUpload = require('../middleware/profile');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = (res, token) => {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });
};

module.exports = Router()
  .post('/signup', profileImgUpload, (req, res, next) => {
    User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.userBio,
      image: req.files.profileImage[0].location,
      timeNeeded: req.body.timeNeeded,
      timeAvailable: req.body.timeAvailable,
      password: req.body.password,
      address: {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode
      },
      dog: [{
        name: req.body.dogName,
        size: req.body.dogSize,
        breed: req.body.breed,
        bio: req.body.dogBio,
        img: req.files.dogImage[0].location
      }]
      
    })
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
    res.clearCookie('session');
    res.end('done');
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  })

  .get('/zipcode/:zipcode', (req, res, next) => {
    const { zipcode } = req.params;
    User
      .find({ 'address.zipcode': zipcode })
      .then(users => res.send(users))
      .catch(next);
  })

  .patch('/profile/:id', (req, res, next) => {
    User
      .findByIdAndUpdate(req.params.id, req.body, { new:true })
      .then(user => res.send(user))
      .catch(next);
  });


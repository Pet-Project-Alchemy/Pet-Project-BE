const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const s3 = new aws.S3({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: 'us-west-2',
  Bucket: 'petprojectalchemyimages'
});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'petprojectalchemyimages',
    acl: 'public-read',
    key: function(req, file, cb) {
      cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([{ name: 'profileImage' }, { name: 'dogImage' }]);

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only please');
  }
}

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = (res, token) => {
  console.log('token', token);
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });
};

module.exports = Router()

  //.post('/signup', (req, res, next) => {
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
      dog: {
        name: req.body.dogName,
        size: req.body.dogSize,
        breed: req.body.breed,
        bio: req.body.dogBio,
        img: req.files.dogImage[0].location
      }
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
        console.log('user found:', user);
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
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



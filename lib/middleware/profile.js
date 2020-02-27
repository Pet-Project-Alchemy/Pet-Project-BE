const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

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
  limits: { fileSize: 6000000 },
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

module.exports = profileImgUpload;

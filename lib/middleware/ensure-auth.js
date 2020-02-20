const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies;
  User
    .findByToken(token)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

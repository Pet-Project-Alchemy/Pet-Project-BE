const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  console.log(token);
  User
    .findByToken(token)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

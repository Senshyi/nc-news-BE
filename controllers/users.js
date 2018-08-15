const { User } = require('../models')

const getUserByUsername = (req, res, next) => {
  User.find({username: req.params.username})
    .then(user => {
      res.status(200).send({user});
    });
};

module.exports = getUserByUsername
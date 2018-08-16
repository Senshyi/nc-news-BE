const { User } = require('../models')

const getUserByUsername = (req, res, next) => {
  User.findOne({username: req.params.username})
    .then(user => {
      if(!user) throw {status: 404, msg: 'User does not exists'}
      res.status(200).send({user});
    })
    .catch(next);
};

module.exports = getUserByUsername
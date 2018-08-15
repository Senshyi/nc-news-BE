const userRoutes = require('express').Router();
const getUserByUsername = require('../controllers/users')

userRoutes.route('/:username')
  .get(getUserByUsername)


module.exports = userRoutes
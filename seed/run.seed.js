const seedDB = require('./seed');
const mongoose = require('mongoose');
const data = require('./devData');
const DB_URL = require('../config/db-config.js');

mongoose.connect(DB_URL, {useNewUrlParser: true})
  .then(() => {
    console.log(`Connected to ${DB_URL}...`);
    return seedDB(data);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Disconnected from ${DB_URL}...`);
  })

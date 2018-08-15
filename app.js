const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./router/api');
const DB_URL = 'mongodb://localhost:27017/nc_news';

mongoose.connect(DB_URL, {useNewUrlParser: true})
  .then(() => {
    console.log(`Connected to ${DB_URL}`);
  });

  app.use(bodyParser.json());

  app.use('/api', apiRouter);

  module.exports = app;


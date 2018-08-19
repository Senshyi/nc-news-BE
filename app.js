const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./router/api');
const DB_URL = process.env.DB_URL || require('./config/db-config.js');

 app.use(bodyParser.json());

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${DB_URL}`);
  });

  app.use('/api', apiRouter);

  app.use('*', (req, res, next) => {
    res.status(404).send('Page not found');
  });

  app.use((err, req, res, next) => {
    if(err.name === 'CastError' || err.name === 'ValidationError') err.status = 400;
    res.status(err.status || 500).send({ msg: err.msg || err.message || 'Internal server error!'})
  })

  module.exports = app;


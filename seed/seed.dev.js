const seedDB = require('./seed');
const mongoose = require('mongoose');
const users = require('./devData/users.json');
const topics = require('./devData/topics.json');
const articles = require('./devData/articles.json');
const comments = require('./devData/comments.json');
const DB_URL = 'mongodb://localhost:27017/nc_news';

mongoose.connect(DB_URL, {useNewUrlParser: true})
  .then(() => {
    console.log(`Connected to ${DB_URL}...`);
    return seedDB(users, topics, articles, comments);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Disconnected from ${DB_URL}...`);
  })

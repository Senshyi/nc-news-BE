const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { formatArticle, formatComment } = require('../utils/index.js')

const seedDB = (users, topics, articles, comments) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([User.insertMany(users), Topic.insertMany(topics)])
    })
    .then(([userDocs, topicDocs]) => {
      return Promise.all([Article.insertMany(formatArticle(articles, userDocs, topicDocs)), userDocs, topicDocs])
    })
    .then(([articleDocs, userDocs, topicDocs]) => {
       return Promise.all([Comment.insertMany(formatComment(comments, articleDocs, userDocs)),userDocs, topicDocs, articleDocs]);
    });
};

module.exports = seedDB;
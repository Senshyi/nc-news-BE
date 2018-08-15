const topicRoutes = require('express').Router();
const { getAllTopics, getArticlesByTopic, addArticleToTopic} = require('../controllers/topics');

topicRoutes.route('/')
  .get(getAllTopics)

topicRoutes.route('/:topic_slug/articles')
  .get(getArticlesByTopic)
  .post(addArticleToTopic)

module.exports = topicRoutes;


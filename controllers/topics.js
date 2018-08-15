const {Topic, Article, User} = require('../models');

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({topics});
    });
};

const getArticlesByTopic = (req, res, next) => {

  Article.find({topic: req.params.topic_slug})
    .then(articles => {
      res.status(200).send({articles});
    })
}

const addArticleToTopic = (req, res, next) => {
  const {title, body, created_by} = req.body;

  User.findOne({_id: created_by})
    .then(user => {
      return Article.create({ title, body, created_by, topic: req.params.topic_slug, belongs_to: user.username})
    })
    .then(article => {
      res.status(201).send({article})
    })
};

module.exports = { getAllTopics, getArticlesByTopic, addArticleToTopic}
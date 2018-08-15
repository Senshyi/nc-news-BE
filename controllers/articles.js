const { Article, Comment } = require('../models');


const getAllArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.status(200).send({articles});
    });
};

const getArticleById = (req, res, next) => {
  Article.find({_id: req.params.article_id})
    .then(article => {
      res.status(200).send({article});
    });
};

const getArticleComments = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id})
    .then(comments => {
      res.status(200).send({comments});
    });
};

const addComment = (req, res, next) => {
  const {body, created_by} = req.body;
  Comment.create({body, created_by, belongs_to: req.params.article_id})
    .then(comment => {
      res.status(200).send({comment});
    });
};

const updateVotes = (req, res, next) => {
  const vote = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : undefined;
  Article.findOneAndUpdate({_id: req.params.article_id}, {$inc:{votes: vote}}, {new: true})
    .then(article => {
      res.status(200).send({article});
    })
    .catch(console.log);
};

module.exports = { getAllArticles, getArticleById, getArticleComments, addComment, updateVotes }
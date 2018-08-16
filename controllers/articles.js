const { Article, Comment, User } = require('../models');


const getAllArticles = (req, res, next) => {
  Article.find()
    .populate('created_by')
    .then(articles => {
      res.status(200).send({articles});
    });
};

const getArticleById = (req, res, next) => {
  Article.findOne({_id: req.params.article_id})
    .then(article => {
      if(!article) throw {status: 404, msg: 'Article not found for specified ID'}
      else res.status(200).send({article});
    })
    .catch(next);
};

const getArticleComments = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id})
    .then(comments => {
      if(comments.length === 0) throw {status: 404, msg: 'Comments for specified ID does not exists'}
      res.status(200).send({comments});
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  const {body, created_by} = req.body;
  Comment.create({body, created_by, belongs_to: req.params.article_id})
    .then(comment => {
      return Promise.all([User.findById(created_by), comment])
    })
    .then(([user, comment]) => {
      res.status(201).send({comment: {
        ...comment.toObject(),
        created_by: user
      }});
    })
    .catch(next)
};

const updateVotes = (req, res, next) => {
  const vote = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : undefined;
  if(!vote) throw {status: 400, msg: 'Invalid query'}
  Article.findOneAndUpdate({_id: req.params.article_id}, {$inc:{votes: vote}}, {new: true})
    .then(article => {
      res.status(200).send({article});
    })
    .catch(next);
};

module.exports = { getAllArticles, getArticleById, getArticleComments, addComment, updateVotes }
const articleRoutes = require('express').Router();
const { getAllArticles, getArticleById, getArticleComments, addComment, updateVotes }  = require('../controllers/articles');

articleRoutes.route('/')
  .get(getAllArticles)

articleRoutes.route('/:article_id')
  .get(getArticleById)
  .put(updateVotes)

articleRoutes.route('/:article_id/comments')
  .get(getArticleComments)
  .post(addComment)

module.exports = articleRoutes;
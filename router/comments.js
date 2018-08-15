const commentRoutes = require('express').Router();
const { updateCommentVotes, removeComment } = require('../controllers/comments');

commentRoutes.route('/:comment_id')
  .put(updateCommentVotes)
  .delete(removeComment)

module.exports = commentRoutes;
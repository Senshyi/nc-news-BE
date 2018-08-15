const { Comment } = require('../models');

const updateCommentVotes = (req, res, next) => {
  const vote = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : undefined;
  Comment.findOneAndUpdate({ _id: req.params.comment_id }, { $inc: { votes: vote } }, { new: true })
    .then(comment => {
      res.status(200).send({ comment });
    })
};

const removeComment = (req, res, next) => {
  Comment.findOneAndRemove({_id: req.params.comment_id})
    .then(comment => {
      res.status(200).send({comment});
    })
}

module.exports = { updateCommentVotes, removeComment }
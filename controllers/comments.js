const { Comment } = require('../models');

const updateCommentVotes = (req, res, next) => {
  const vote = req.query.vote === 'up' ? 1 : req.query.vote === 'down' ? -1 : undefined;
  if(!vote) throw {status: 400, msg: 'Invalid query'};
  Comment.findOneAndUpdate({ _id: req.params.comment_id }, { $inc: { votes: vote } }, { new: true })
    .populate('created_by')
    .then(comment => {
      if(!comment) throw {status: 404, msg: 'Comment ID does not exists'}
      res.status(200).send({ comment });
    })
    .catch(next)
};

const removeComment = (req, res, next) => {
  Comment.findOneAndRemove({_id: req.params.comment_id})
    .then(comment => {
      if(!comment) throw {status: 404, msg: 'Comment not found'}
      res.status(200).send({comment});
    })
    .catch(next)
};

module.exports = { updateCommentVotes, removeComment }
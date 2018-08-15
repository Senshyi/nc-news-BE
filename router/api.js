const apiRouter = require('express').Router();
const topicRouter = require('./topics.js');
const articleRouter = require('./articles.js');
const commentRouter = require('./comments.js');
const userRouter = require('./users.js')
const { getAllEndpoints } = require('../controllers/api');

apiRouter.route('/')
  .get(getAllEndpoints)

apiRouter.use('/topics', topicRouter)
apiRouter.use('/articles', articleRouter)
apiRouter.use('/comments', commentRouter)
apiRouter.use('/users', userRouter)



module.exports = apiRouter;


process.env.NODE_ENV = 'test';
const app = require('../app.js');
const request = require('supertest')(app);
const { expect } = require('chai');
const mongoose = require('mongoose');
const testData = require('../seed/testData')
const seedDB = require('../seed/seed.js');


describe('NC NEWS API', () => {
  let commentDocs, userDocs, topicDocs, articleDocs, wrongID = mongoose.Types.ObjectId();
  beforeEach(() => {
    return seedDB(testData).then( docs => {
      [commentDocs, userDocs, topicDocs, articleDocs] = docs
    });
  });
  after(() => mongoose.disconnect());

  describe('/topics', () => {
    it('GET returns status 200 and an object containing all topics', () => {
      return request.get('/api/topics')
        .expect(200)
        .then(res => {
          const { topics } = res.body
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('topics');
          expect(topics).to.be.a('array');
          expect(topics.length).to.equal(2);
          expect(topics[0]).to.have.all.keys(
            '_id',
            '__v',
            'slug',
            'title'
          );
          expect(topics[0].title).to.equal(topicDocs[0].title);
          expect(topics[0].slug).to.equal(topicDocs[0].slug);
        });
    });
  });
  describe('/topics/:topic_slug/articles',() => {
    it('GET returns status 200 and an object with all articles for certain topic', () => {
      return request.get('/api/topics/cats/articles')
        .expect(200)
        .then(res => {
          const { articles } = res.body;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('articles');
          expect(articles).to.be.a('array');
          expect(Array.isArray(articles)).to.be.true;
          expect(articles.length).to.equal(2);
          expect(articles[0]).to.have.all.keys(
            '_id',
            'title',
            'body',
            'topic',
            'belongs_to',
            'created_at',
            '__v',
            'created_by',
            'votes'
          );
          expect(articles[0].title).to.equal(articleDocs[2].title);
          expect(articles[0].body).to.equal(articleDocs[2].body);
          expect(articles[0].belongs_to).to.equal(articleDocs[2].belongs_to);
        });
    });
    it('GET returns status 404 and error message if the topic slug does not exists', () => {
      return request.get('/api/topics/coding/articles')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('articles for coding topic not found');
        });
    });
    it('POST returns status 201, article object and adds an article to the database',() => {
      const newArticle = {
        title: 'test title',
        body: 'test body',
        created_by: userDocs[0]._id
      }
      return request.post('/api/topics/mitch/articles')
        .send(newArticle)
        .expect(201)
        .then(res => {
          const { article } = res.body
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('article');
          expect(article).to.be.a('object');
          expect(article).to.have.all.keys(
            '_id',
            'title',
            'body',
            'topic',
            'belongs_to',
            'created_at',
            '__v',
            'created_by',
            'votes'
          );
          expect(article.title).to.equal(newArticle.title);
          expect(article.body).to.equal(newArticle.body);
          expect(article.created_by).to.equal(`${newArticle.created_by}`);
        });
    });
    it('POST returns status 400 and error message when a required field is missing', () => {
      const newArticle = {
        body: 'test body',
        created_by: userDocs[0]._id
      }
      return request.post('/api/topics/mitch/articles')
        .send(newArticle)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('articles validation failed: title: Path `title` is required.');
        });
    });
  });
  describe('/articles', () => {
    it('returns status 200 and object containing all articles', () => {
      return request.get('/api/articles')
      .expect(200)
      .then(res => {
        const { articles } = res.body;
        expect(res.body).to.be.a('object');
        expect(articles).to.be.a('array');
        expect(articles.length).to.equal(4);
        expect(articles[0]).to.have.all.keys(
          'votes',
          'created_at',
          '_id',
          'title',
          'topic',
          'created_by',
          'body',
          'belongs_to',
          '__v',
          'comments'
        )
        expect(articles[0]._id).to.equal(`${articleDocs[0]._id}`);
        expect(articles[0].title).to.equal(articleDocs[0].title);
        expect(articles[0].topic).to.equal(articleDocs[0].topic);
        expect(articles[0].body).to.equal(articleDocs[0].body);
        expect(articles[0].belongs_to).to.equal(`${articleDocs[0].belongs_to}`);
        expect(articles[0].created_by).to.equal(`${articleDocs[0].created_by}`)
        expect(articles[0].comments).to.equal(2);
      });
    });
  });
  describe('/articles/:article_id', () => {
    it('GET returns 200 and an individual article ', () => {
      return request.get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          const { article } = res.body;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('article');
          expect(article).to.be.a('object');
          expect(article).to.have.all.keys(
            'votes',
            'created_at',
            '_id',
            'title',
            'topic',
            'created_by',
            'body',
            'belongs_to',
            '__v',
            'comments'
          );
          expect(article.votes).to.equal(articleDocs[0].votes);
            expect(article.title).to.equal(articleDocs[0].title);
            expect(article.topic).to.equal(articleDocs[0].topic);
            expect(article.body).to.equal(articleDocs[0].body);
            expect(article.belongs_to).to.equal(articleDocs[0].belongs_to);
            expect(article.__v).to.equal(articleDocs[0].__v);
          expect(article._id).to.equal(`${articleDocs[0]._id}`);
        });
    });
    it('GET returns status 400 when ID is invalid', () => {
      return request.get('/api/articles/invalidID')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Cast to ObjectId failed for value "invalidID" at path "_id" for model "articles"');
        });
    });
    it('GET returns status 404 if article does not exists', () => {
      return request.get(`/api/articles/${wrongID}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Article not found for specified ID')
        });
    });
    it('PUT update article votes and returns status 200 with updated article object', () => {
      return request.put(`/api/articles/${articleDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          const { article } = res.body
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('article');
          expect(article).to.be.a('object');
          expect(article).to.have.all.keys(
            'votes',
            'created_at',
            '_id',
            'title',
            'topic',
            'created_by',
            'body',
            'belongs_to',
            '__v'
          );
          expect(article.votes).to.equal(articleDocs[0].votes + 1);
          expect(article.title).to.equal(articleDocs[0].title);
          expect(article.topic).to.equal(articleDocs[0].topic);
          expect(article.belongs_to).to.equal(articleDocs[0].belongs_to);
          expect(article.body).to.equal(articleDocs[0].body);
          expect(article.created_by).to.equal(`${articleDocs[0].created_by}`);
        });
    });
    it('PUT returns status 400 and error message when query is invalid', () => {
      return request.put(`/api/articles/${articleDocs[0]._id}?wrong=query`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid query');
        });
    });
  });
  describe('/articles/:article_id/comments', () => {
    it('GET returns status 200 and an object containing all comments for specified article', () => {
      return request.get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          const { comments } = res.body;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('comments');
          expect(comments).to.be.a('array');
          expect(comments.length).to.equal(2);
          expect(comments[0]).to.have.all.keys(
            '_id',
            'votes',
            'body',
            'belongs_to',
            'created_by',
            '__v',
            'created_at'
          );
          expect(comments[0].votes).to.equal(7);
          expect(comments[0].body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.');
        });
    });
    it('GET returns status 400 when ID is invalid', () => {
      return request.get('/api/articles/invalidID/comments')
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Cast to ObjectId failed for value "invalidID" at path "belongs_to" for model "comments"');
        });
    });
    it('POST returns status 201, object with added comment and adds comment to database', () => {
      const testComment = {
        body: 'test comment',
        created_by: userDocs[0]._id
      }
      return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(testComment)
        .expect(201)
        .then(res => {
          const { comment } = res.body;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('comment');
          expect(comment).to.be.a('object');
          expect(comment).to.have.all.keys(
            '_id',
            'body',
            'created_by',
            'belongs_to',
            '__v',
            'created_at',
            'votes'
          );
          expect(comment.body).to.equal('test comment');
          expect(res.body.comment.belongs_to).to.eql(`${articleDocs[0]._id}`);
          expect(comment.votes).to.equal(0);
          expect(comment.created_by).to.have.all.keys(
            '_id',
            'username',
            'name',
            'avatar_url',
            '__v'
          );
          expect(comment.created_by._id).to.be.equal(`${userDocs[0]._id}`);
          expect(comment.created_by.username).to.equal(userDocs[0].username);
          expect(comment.created_by.name).to.equal(userDocs[0].name);
        });
    });
    it('POST returns status 400 when required field is missing', () => {
      const testComment = {
        created_by: userDocs[0]._id
      }
      return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(testComment)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('comments validation failed: body: Path `body` is required.')
        });
    });
  });
  describe('/comments/:comment_id', () => {
    it('PUT updates comment votes and returns status 200 with updated comment object', () => {
      return request.put(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          const { comment } = res.body;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('comment');
          expect(comment).to.be.a('object');
          expect(comment).to.have.all.keys(
            '_id',
            '__v',
            'belongs_to',
            'body',
            'created_at',
            'created_by',
            'votes'
          );
          expect(comment.votes).to.equal(commentDocs[0].votes - 1);
          expect(comment._id).to.equal(`${commentDocs[0]._id}`);
          expect(comment.body).to.equal(commentDocs[0].body);
        });
    });
    it('PUT returns 400 when query is invalid', () => {
      return request.put(`/api/comments/${commentDocs[0]._id}?wrong=query`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Invalid query');
        });
    });
    it('PUT returns 404 when ID does not exists', () => {
      return request.put(`/api/comments/${wrongID}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Comment ID does not exists');
        });
    });
    it('DELETE removes specified comment and returns status 200 with deleted comment', () => {
      return request.del(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(res => {
          const { comment } = res.body
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('comment');
          expect(comment).to.be.a('object');
          expect(res.body.comment).to.have.all.keys(
            '_id',
            '__v',
            'belongs_to',
            'body',
            'created_at',
            'created_by',
            'votes'
          );
          expect(comment._id).to.equal(`${commentDocs[0]._id}`);
          expect(comment.belongs_to).to.equal(`${commentDocs[0].belongs_to}`);
          expect(comment.body).to.equal(commentDocs[0].body);
          expect(comment.votes).to.equal(commentDocs[0].votes);
          expect(comment.created_by).to.equal(`${commentDocs[0].created_by}`);
        });
    });
    it('DELETE returns status 404 and err message when comment ID does not exist', () => {
      return request.del(`/api/comments/${wrongID}`)
        .expect(404)
        .then( res => {
          expect(res.body.msg).to.equal('Comment not found')
        })
    })
    it('DELETE returns status 400 and err message when ID is invalid', () => {
      return request.del(`/api/comments/$invalidID`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('Cast to ObjectId failed for value "$invalidID" at path "_id" for model "comments"')
        })
    })
  });
  describe('/users/:username',() => {
    it('GET returns status 200 and an object with profile data for the specified user', () => {
      return request.get(`/api/users/${userDocs[0].username}`)
        .expect(200)
        .then(res => {
          const { user } = res.body
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('user');
          expect(user).to.be.a('object');
          expect(user).to.have.all.keys(
            '_id',
            '__v',
            'avatar_url',
            'name',
            'username'
          );
          expect(user._id).to.equal(`${userDocs[0]._id}`);
          expect(user.name).to.equal(userDocs[0].name);
          expect(user.username).to.equal(userDocs[0].username);
          expect(user.avatar_url).to.equal(userDocs[0].avatar_url);
        });
    });
    it('GET returns status 404 when username does not exists', () => {
      return request.get('/api/users/notauser')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('User does not exists');
        });
    });
  });
});
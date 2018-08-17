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
    it('GET returns status 200 and an object containing all articles', () => {
      return request.get('/api/topics')
        .expect(200)
        .then(res => {
          const { topics } = res.body
          expect(Array.isArray(topics)).to.be.true;
          expect(topics.length).to.equal(2);
          expect(topics[0]).to.have.all.keys(
            '_id',
            '__v',
            'slug',
            'title'
          );
          expect(topics[0].title).to.equal('Mitch');
          expect(topics[0].slug).to.equal('mitch');
        });
    });
  });
  describe('/topics/:topic_slug/articles',() => {
    it('GET returns status 200 and an object with all articles for certain topic', () => {
      return request.get('/api/topics/cats/articles')
        .expect(200)
        .then(res => {
          const { articles } = res.body;
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
          expect(articles[0].title).to.equal('They\'re not exactly dogs, are they?');
          expect(articles[0].body).to.equal('Well? Think about it.');
          expect(articles[0].belongs_to).to.equal('butter_bridge');
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
          expect(res.body.article).to.have.all.keys(
            '_id',
            'title',
            'body',
            'topic',
            'belongs_to',
            'created_at',
            '__v',
            'created_by',
            'votes'
          )
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
        expect(res.body.articles.length).to.equal(4);
      });
    });
  });
  describe('/articles/:article_id', () => {
    it('GET returns 200 and an individual article ', () => {
      return request.get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.have.all.keys(
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
          expect(res.body.article.votes).to.equal(0),
          expect(res.body.article.title).to.equal('Living in the shadow of a great man'),
          expect(res.body.article.topic).to.equal('mitch'),
          expect(res.body.article.body).to.equal('I find this existence challenging'),
          expect(res.body.article.belongs_to).to.equal('butter_bridge'),
          expect(res.body.article.__v).to.equal(0)
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
          expect(article.votes).to.equal(1);
          expect(article.title).to.equal('Living in the shadow of a great man');
          expect(article.topic).to.equal('mitch');
          expect(article.belongs_to).to.equal('butter_bridge');
          expect(article.body).to.equal('I find this existence challenging');
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
    it('GET returns status 404 when comments for particular article does not exists', () => {
      return request.get(`/api/articles/${wrongID}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('Comments for specified ID does not exists');
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
          expect(comment.created_by.username).to.equal('butter_bridge');
          expect(comment.created_by.name).to.equal('jonny')
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
          expect(comment).to.have.all.keys(
            '_id',
            '__v',
            'belongs_to',
            'body',
            'created_at',
            'created_by',
            'votes'
          );
          expect(comment.votes).to.equal(6);
          
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
          expect(res.body.comment).to.have.all.keys(
            '_id',
            '__v',
            'belongs_to',
            'body',
            'created_at',
            'created_by',
            'votes'
          );
        });
    });
  });
  describe('/users/:username',() => {
    it('GET returns status 200 and an object with profile data for the specified user', () => {
      return request.get(`/api/users/${userDocs[0].username}`)
        .expect(200)
        .then(res => {
          const { user } = res.body
          expect(user).to.have.all.keys(
            '_id',
            '__v',
            'avatar_url',
            'name',
            'username'
          );
          expect(user.name).to.equal('jonny')
          expect(user.username).to.equal('butter_bridge')
          expect(user.avatar_url).to.equal('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
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
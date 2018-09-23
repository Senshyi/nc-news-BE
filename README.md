# NC-NEWS
[NC-NEWS](https://jan-nc-news.herokuapp.com/api) is a RESTful API built for serving article themed data for use with front-end application.

See the deployed version [here](https://jan-nc-news.herokuapp.com/api)

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Setting up a development and testing environment for this project first requires a code editor and MongoDB.

for `mongoDB` you can find installation instructions [here](https://docs.mongodb.com/manual/installation/)

### Installation

Open your terminal and navigate to the directory where you want to save the application.
Then use the following commands:
clone repository:
```
git clone https://github.com/JanMach97/BE2-northcoders-news.git
```
navigate into the cloned directory:
```
cd BE2-northcoders-news
```
Install dependencies:
```
npm i
```
The application also requires a specific confing file to connect and to seed database:
```
mkdir config
touch config/db-config.js
```
config file should be in following format:
```js
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const dbConfig = { 
  test: 'mongodb url for test', 
  development: 'mongodb url for development'
};
module.exports = dbConfig[process.env.NODE_ENV]
```
The final step is to run mongo on your local machine:
```
mongod
```

## Running the tests

This API has been tested before deployment. To run the included tests use the command:
```
npm test
```

## Routes

The following endpoints are available:

```http
GET /api
```
Homepage


```http
GET /api/topics
```

Gets all the topics

```http
GET /api/topics/:topic_slug/articles
```

Returns all the articles for a certain topic, e.g: `/api/topics/football/articles`

```http
POST /api/topics/:topic_slug/articles
```

Adds a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: `{ "title": "new article", "body": "This is my new article content"}`

```http
GET /api/articles
```

Returns all the articles

```http
GET /api/articles/:article_id
```

Gets an individual article

```http
GET /api/articles/:article_id/comments
```

Gets all the comments for a individual article

```http
POST /api/articles/:article_id/comments
```

Adds a new comment to an article. This route requires a JSON body with body and created_by key value pairs
e.g: `{"body": "This is my new comment", "created_by": <mongo id for a user>}`

```http
PUT /api/articles/:article_id
```

Increments or decrements the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/articles/:article_id?vote=up`

```http
PUT /api/comments/:comment_id
```

Increments or decrements the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/comments/:comment_id?vote=down`

```http
DELETE /api/comments/:comment_id
```

Deletes a comment

```http
GET /api/users/:username
```

e.g: `/api/users/mitch123`

Returns a JSON object with the profile data for the specified user.

## Deployment

This project uses [Mlab](https://mlab.com/) to host the database and [Heroku](https://www.heroku.com/) for hosting the app itself.

## Built with

- node.js - v10.8.0
- mongo - v3.6.2
- mongoose - v5.2.9
- Express - 4.16.3
- Javascript - ES6

## Author

[Jan Machacek](https://github.com/JanMach97)

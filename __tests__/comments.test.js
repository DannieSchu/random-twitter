require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Comment = require('../lib/models/Comment');
const Tweet = require('../lib/models/Tweet');

/*
[ ]`POST /api/v1/comments` create a comment
[ ]`GET /api/v1/comments/:id` get a comment by id and populate tweet
[ ]`PATCH /api/v1/comments/:id` update a comment
[ ]`DELETE /api/v1/comments/:id` delete a comment
*/

describe('tweet routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a new comment', () => {
    return Tweet
      .create({
        handle: '@something',
        text: 'commentary about COVID-19',
      })
      .then(tweet => {
        return request(app)
          .post('/api/vi/comments')
          .send({
            tweetId: tweet.id,
            handle: '@commentcrazy',
            text: 'must respond to everything'
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              tweetId: expect.any(String),
              handle: '@commentcrazy',
              text: 'must respond to everything',
              __v: 0
            });
          });
      });
  });

});

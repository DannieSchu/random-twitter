require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Comment = require('../lib/models/Comment');
const Tweet = require('../lib/models/Tweet');

/*
[X]`POST /api/v1/comments` create a comment
[X]`GET /api/v1/comments/:id` get a comment by id and populate tweet
[X]`PATCH /api/v1/comments/:id` update a comment
[ ]`DELETE /api/v1/comments/:id` delete a comment
*/

describe('comment routes', () => {
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
          .post('/api/v1/comments')
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

  it('gets a single comment by its id', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something', 
      text: 'commentary about COVID-19' 
    });
    const comment = await Comment.create({
      tweetId: tweet.id,
      handle: '@commentcrazy',
      text: 'must respond to everything'
    });

    // asked to populate in route so using whole tweet rather than just id
    return request(app)
      .get(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: {
            _id: expect.any(String),
            handle: '@something', 
            text: 'commentary about COVID-19',
            __v: 0 
          },
          handle: '@commentcrazy',
          text: 'must respond to everything',
          __v: 0
        });
      });
  });

  it('updates a comment', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something', 
      text: 'commentary about COVID-19' 
    });
    const comment = await Comment.create({
      tweetId: tweet.id,
      handle: '@commentcrazy',
      text: 'must respond to everything'
    });

    return request(app)
      .patch(`/api/v1/comments/${comment._id}`)
      .send({ text: 'some dog joke' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: tweet.id,
          handle: '@commentcrazy',
          text: 'some dog joke',
          __v: 0
        });
      });
  });
});

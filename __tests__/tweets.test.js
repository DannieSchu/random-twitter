require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');

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

  it('creates a new tweet', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: '@something',
        text: 'commentary about COVID-19'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something',
          text: 'commentary about COVID-19',
          __v: 0
        });
      });
  });

  it('creates a random tweet', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: '@secretswanson',
        text: ''
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@secretswanson',
          text: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets all tweets', async() => {
    const tweets = await Tweet.create([
      { handle: '@something', text: 'commentary about COVID-19' },
      { handle: '@someotherhandle', text: 'other commentary about COVID-19' },
      { handle: '@caninelover', text: 'dog pic' }
    ]);

    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        tweets.forEach(tweet => {
          expect(res.body).toContainEqual({
            __v: 0,
            _id: tweet._id.toString(),
            handle: tweet.handle,
            text: tweet.text
          });
        });
      });
  });

  it('gets a single tweet by its id', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something', 
      text: 'commentary about COVID-19' 
    });
    await Comment.create([
      {
        tweetId: tweet.id,
        handle: '@commentcrazy',
        text: 'must respond to everything'
      },
      {
        tweetId: tweet.id,
        handle: '@someoneelse',
        text: 'another comment'
      },
      {
        tweetId: tweet.id,
        handle: '@commentcrazy',
        text: 'response to response'
      }
    ]);

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        // console.log(res.body.comments);
        expect(res.body.comments).toHaveLength(3);
        expect(res.body).toEqual({
          _id: expect.any(String),
          comments: expect.any(Array),
          handle: '@something',
          text: 'commentary about COVID-19',
          __v: 0
        });
      });
  });

  it('updates text in a tweet', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something', 
      text: 'commentary about COVID-19' 
    });

    return request(app)
      .patch(`/api/v1/tweets/${tweet._id}`)
      .send({ text: 'some dog joke' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something',
          text: 'some dog joke',
          __v: 0
        });
      });
  });
  
  it('deletes a tweet', async() => {
    const tweet = await Tweet.create({ 
      handle: '@something', 
      text: 'commentary about COVID-19' 
    });
  
    return request(app)
      .delete(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@something',
          text: 'commentary about COVID-19',
          __v: 0
        });
      });
  });
});


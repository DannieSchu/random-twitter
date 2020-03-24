require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

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
  
  // `POST /api/v1/tweets` to create a new tweet
  // `GET /api/v1/tweets` to get all tweets
  // `GET /api/v1/tweets/:id` to get a tweet by ID
  // `PATCH /api/v1/tweets/:id` to update a tweets text **ONLY**
  // `DELETE /api/v1/tweets/:id` to delete a tweet

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
});



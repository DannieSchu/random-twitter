const { Router } = require('express');

const Tweet = require('../models/Tweet');

module.exports = Router() 
  .post('/', (req, res, next) => {
    Tweet
      .create(req.body)
      .then(tweet => res.send(tweet))
      .catch(next);
  });
  
const { Router } = require('express');
const Tweet = require('../models/Tweet');
const Comment = require('../models/Comment');

module.exports = Router() 
  .post('/', (req, res, next) => {
    Comment
      .create(req.body)
      .then(comment => res.send(comment))
      .catch(next);
  })

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

  .get('/:id', (req, res, next) => {
    Comment
      .findById(req.params.id)
      .populate('tweetId')
      .then(comment => res.send(comment))
      .catch(next);
  })
  
  .patch('/:id', (req, res, next) => {
    Comment
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(comment => res.send(comment))
      .catch(next);
  });
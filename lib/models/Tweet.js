const mongoose = require('mongoose');
const getSwansonQuote = require('../services/swanson');

// tweet schema
const schema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

// populate all comments for a tweet
schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweetId'
});

// use mongoose middleware to insert random Ron Swanson quote into empty tweets
schema.pre('validate', async function(next) {
  if(this.text.length) return next();
  this.text = await getSwansonQuote();
  next();
});

module.exports = mongoose.model('Tweet', schema);

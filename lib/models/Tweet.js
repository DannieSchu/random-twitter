const mongoose = require('mongoose');
const getSwansonQuote = require('../services/swanson');

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

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweetId'
});

schema.pre('validate', async function(next) {
  if(this.text.length) return next();
  this.text = await getSwansonQuote();
  next();
});

module.exports = mongoose.model('Tweet', schema);

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

// takes in a tweet text and inserts quote for value 
// schema.methods.insertSwanson = function() {
//   return Promise.all(
//     this.text
//       .then(() => this.text = getSwansonQuote())
//       .then(([quote]) = quote)
//   )
// }


// Update your model so if the text is empty you fetch a random quote from an API (e.g. the futurama API) and use that as text. Use mongoose middleware for this.
// { handle: 'ryan' } -> { handle: 'ryan', text: 'RANDOM QUOTE FROM API' }


// schema.pre('validate', function(next) {
//   if(this.text.length) return next;
//   this
//     .then(() => this.text = getSwansonQuote())
//     .then(() => next());
// });
schema.pre('validate', async function(next) {
  if(this.text.length) return next();
  this.text = await getSwansonQuote();
  next();
});

module.exports = mongoose.model('Tweet', schema);

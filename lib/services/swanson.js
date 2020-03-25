const request = require ('superagent');

// get a random ron swanson quote from api and return as string
module.exports = () => {
  return request
    .get('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
    .then(res => res.body)
    .then(([result]) => result);
};

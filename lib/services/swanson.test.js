const getSwansonQuote = require('./swanson');

// jest.mock('superagent', () => {
//   return {
//     get() {
//       return Promise.resolve ({
//         body: [
//           'The less I know about other people\'s affairs, the happier I am. I\'m not interested in caring about people. I once worked with a guy for three years and never learned his name. Best friend I ever had. We still never talk sometimes.'
//         ]
//       });
//     }
//   };
// });

// test that api call returns a string
describe('get swanson quote function', () => {
  it('gets a string', () => {
    return getSwansonQuote()
      .then(() => {
        expect.any(String);
      });
  });
});

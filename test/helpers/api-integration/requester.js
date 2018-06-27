/**
 * Created on 27-Jun-18.
 */
const supertest = require('supertest');
const app = require('../../../app');


function requester () {
  return {
    get: _requestMaker('get'),
    post: _requestMaker('post'),
    put: _requestMaker('put'),
    del: _requestMaker('del'),
  };
}

function _requestMaker (method) {

  return (route, send, query) => {
    return new Promise((resolve, reject) => {

      let url = `/api${route}`;

      let request = supertest(app)[method](url)
        .accept('application/json');

      request
        .query(query)
        .send(send)
        .end((err, response) => {
          if (err) {
            const parsedError = _parseError(err);
            return reject(parsedError);
          }
          resolve(response);
        });
    });
  };
}


/**
 * parse error response to include http status so that we don't need to assert the status and body separately
 */
function _parseError (err) {

  const parsedError = {
    status: err.status,
    code: err.body.code,
    message: err.body.message,
  };
  if (err.body.errors) {
    parsedError.errors = err.body.errors;
  }

  return parsedError;
}

module.exports = requester;
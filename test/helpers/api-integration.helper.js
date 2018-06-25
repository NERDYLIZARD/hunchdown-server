/**
 * Created on 25-Jun-18.
 */
const { connectDatabase, disconnectDatabase } = require('./mongo.helper');

before((done) => {
  connectDatabase()
    .then(() => done())
    .catch(done);
});

after((done) => {
  disconnectDatabase()
    .then(() => done())
    .catch(done);
});
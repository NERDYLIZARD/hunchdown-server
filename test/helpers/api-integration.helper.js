/**
 * Created on 25-Jun-18.
 */
const { connectDatabase, disconnectDatabase } = require('../../utils/test/helpers');

before(async () => {
  await connectDatabase();
});

after(async () => {
  await disconnectDatabase();
});
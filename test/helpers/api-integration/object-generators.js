/**
 * Created on 27-Jun-18.
 */
const requester = require('./requester');
const { ApiHunch } = require('./api-classes');


module.exports.generateHunch = async function generateHunch(details = {}) {

  details.wisdom = details.wisdom || 'wisdom';
  details.attribute = details.attribute || 'attribute';

  const hunch = await requester().post('/hunches', details);
  const apiHunch = new ApiHunch(hunch);

  return apiHunch;
};
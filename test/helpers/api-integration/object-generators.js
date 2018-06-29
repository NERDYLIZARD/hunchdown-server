/**
 * Created on 27-Jun-18.
 */
const requester = require('./requester');
const { ApiHunch, ApiBox } = require('./api-classes');


module.exports.generateHunch = async function generateHunch(boxes, details = {}) {
  details.boxes = boxes.map(box => box.id);
  details.wisdom = details.wisdom || 'wisdom';
  details.attribute = details.attribute || 'attribute';

  const hunch = await requester().post('/hunches', details);
  const apiHunch = new ApiHunch(hunch);

  return apiHunch;
};

module.exports.generateBox = async function generateBox(details = {}) {
  details.title = details.title || 'title';
  details.description = details.description || 'description';

  const box = await requester().post('/boxes', details);
  const apiBox = new ApiBox(box);

  return apiBox;
};
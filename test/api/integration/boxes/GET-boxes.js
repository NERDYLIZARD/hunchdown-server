/**
 * Created on 25-Jun-18.
 */
const { generateBox, requester } = require('../../../helpers/api-integration.helper');

describe('GET /boxes', () => {

  before(async () => {
    const generateBoxPromises = [];
    for (let i = 1; i <= 12; ++i) {
      generateBoxPromises.push(generateBox());
    }
    await Promise.all(generateBoxPromises);
  });

  it('returns all boxes when request with no `pagination` query', async () => {
    const boxes = await requester().get('/boxes');
    expect(boxes.length).to.equal(12);
  });

  it('returns a number of boxes according to `pagination` query', async () => {
    const boxes = await requester().get('/boxes?page=2&perPage=5');
    expect(boxes.length).to.equal(5);
  });

  it('returns boxes with embed properties according to `embeds` query');

  it('returns boxes with only selected fields according to `fields` query');

});

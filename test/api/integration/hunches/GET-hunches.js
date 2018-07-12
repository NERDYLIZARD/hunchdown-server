/**
 * Created on 25-Jun-18.
 */
const { generateHunch, generateBox, requester } = require('../../../helpers/api-integration.helper');

describe('GET /hunches', () => {

  before(async () => {
    const box = await generateBox();
    const generateHunchPromises = [];
    for (let i = 1; i <= 12; ++i) {
      generateHunchPromises.push(generateHunch([box]));
    }
    await Promise.all(generateHunchPromises);
  });

  it('returns all hunches when request with no `pagination`', async () => {
    const hunches = await requester().get('/hunches');
    expect(hunches.length).to.equal(12);
  });

  it('returns a number of hunches according to `pagination` query', async () => {
    const hunches = await requester().get('/hunches?page=2&perPage=5');
    expect(hunches.length).to.equal(5);
  });

  it('returns hunches with embed properties according to `embeds` query');

  it('returns hunches with only selected fields according to `fields` query');

});

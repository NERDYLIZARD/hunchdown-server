/**
 * Created on 25-Jun-18.
 */
require('../../../helpers/api-integration.helper');
const requester = require('../../../helpers/api-integration/requester');
const { generateHunch } = require('../../../helpers/api-integration/object-generators');

describe('GET /hunches', () => {

  context('Success', () => {

    before(async () => {
      await generateHunch();
    });

    it('returns status 200', async () => {
      const response = await requester().get('/hunches');
      expect(response.status).to.eql(200);
    });

    it('returns header with `Link`, `X-Current-Page` and `X-Total-Pages`', async () => {
      const response = await requester().get('/hunches');

      expect(response.header.link).to.exist;

      expect(response.header['x-current-page']).to.exist;
      expect(response.header['x-current-page']).to.eql('1');

      expect(response.header['x-total-pages']).to.exist;
    });

    it('returns JSON array', async () => {
      const response = await requester().get('/hunches');
      expect(response.body).to.be.an('array');
    });

  });
});
/**
 * Created on 25-Jun-18.
 */
require('../../../helpers/api-integration.helper');
const requester = require('../../../helpers/api-integration/requester');
const { generateHunch, generateBox } = require('../../../helpers/api-integration/object-generators');

describe('GET /hunches/hunchId', () => {

  it('cannot get a non-existent hunch', async () => {
    let dummyId = '5b0e80e0a0014025848632ac';

    await expect(requester().get(`/hunches/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      code: 'NotFound',
      message: 'The hunch is not found.'
    });
  });

});

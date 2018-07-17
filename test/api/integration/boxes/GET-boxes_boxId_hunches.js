/**
 * Created on 17-Jul-18.
 */
const {Types: {ObjectId}} = require('mongoose');
const {generateHunch, generateBox, requester} = require('../../../helpers/api-integration.helper');

describe('GET /boxes/boxId/hunches', () => {

  it('cannot get `hunches` of a non-existent `box`', async () => {
    const dummyId = ObjectId();

    await expect(requester().get(`/boxes/${dummyId}/hunches`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'boxNotFound'
    });
  });

  context('Getting `hunches` in the `box`', () => {
    let box;
    let hunch;

    beforeEach(async () => {
      box = await generateBox();
      hunch = await generateHunch(box);
      await box.sync();
    });

    it('returns `hunches` in the box', async () => {
      const hunches = await requester().get(`/boxes/${box.id}/hunches`);
      hunches.forEach(hunch => {
        expect(hunch.boxes).to.include(box.id);
      });
    });

  });
});

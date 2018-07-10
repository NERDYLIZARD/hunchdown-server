/**
 * Created on 25-Jun-18.
 */
require('../../../helpers/api-integration.helper');
const mongoose = require('mongoose');
const requester = require('../../../helpers/api-integration/requester');
const { generateHunch, generateBox } = require('../../../helpers/api-integration/object-generators');

describe('GET /hunches/hunchId', () => {

  it('cannot get a non-existent hunch', async () => {
    const dummyId = mongoose.Types.ObjectId();

    await expect(requester().get(`/hunches/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      code: 'NotFound',
      message: 'hunchNotFound'
    });
  });

  context('Success', () => {
    let box;
    let hunch;
    
    beforeEach(async () => {
      box = await generateBox();
      hunch = await generateHunch(box);
    });

    it('returns hunch data', async () => {
      await hunch.sync();
      const _hunch = await requester().get(`/hunches/${hunch.id}`);

      expect(_hunch.id).to.equal(hunch.id);
      expect(_hunch.wisdom).to.equal(hunch.wisdom);
      expect(_hunch.attribute).to.equal(hunch.attribute);
      expect(_hunch.boxes).to.eql(hunch.boxes.map(box => box.id));
      expect(_hunch.url).to.exist;
      expect(_hunch.boxesUrl).to.exist;
    });

  });
});

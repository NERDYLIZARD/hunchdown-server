/**
 * Created on 12-Jul-18.
 */
const { checkExistence } = require('../../../helpers/api-integration.helper');
const { Types: { ObjectId }} = require('mongoose');
const requester = require('../../../helpers/api-integration/requester');
const { generateHunch, generateBox } = require('../../../helpers/api-integration/object-generators');

describe('DELETE /hunches/hunchId', () => {

  it('cannot delete a non-existent hunch', async () => {
    const dummyId = ObjectId();

    await expect(requester().del(`/hunches/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'hunchNotFound'
    });
  });

  context('Deleting a hunch', () => {
    let box;
    let hunch;
    
    beforeEach(async () => {
      box = await generateBox();
      hunch = await generateHunch(box);
      await box.sync();
    });

    it('deletes a hunch', async () => {
      expect(box.hunches).to.includes(hunch.id);
      await expect(checkExistence('Hunch', hunch.id)).to.eventually.equal(true);

      await requester().del(`/hunches/${hunch.id}`);
      await box.sync();

      await expect(checkExistence('Hunch', hunch.id)).to.eventually.equal(false);
      expect(box.hunches).to.not.includes(hunch.id);
    });

  });

});

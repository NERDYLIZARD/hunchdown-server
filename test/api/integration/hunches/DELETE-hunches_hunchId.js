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
      await hunch.sync();
    });

    it('deletes a hunch', async () => {
      await requester().del(`/hunches/${hunch.id}`);
      await expect(checkExistence('hunches', hunch.id)).to.eventually.equal(false);
    });

  });

});

/**
 * Created on 16-Jul-18.
 */
const { checkExistence } = require('../../../helpers/api-integration.helper');
const { Types: { ObjectId }} = require('mongoose');
const requester = require('../../../helpers/api-integration/requester');
const { generateHunch, generateBox } = require('../../../helpers/api-integration/object-generators');

describe('DELETE /boxes/boxId', () => {

  it('cannot delete a non-existent box', async () => {
    const dummyId = ObjectId();

    await expect(requester().del(`/boxes/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'boxNotFound'
    });
  });

  context('Deleting a box', () => {
    let box;
    let hunch;

    beforeEach(async () => {
      box = await generateBox();
      hunch = await generateHunch(box);
      await hunch.sync();
    });

    it('deletes a box', async () => {
      expect(hunch.boxes).to.includes(box.id);
      await expect(checkExistence('Box', box.id)).to.eventually.equal(true);

      await requester().del(`/boxes/${box.id}`);
      await hunch.sync();

      await expect(checkExistence('Box', box.id)).to.eventually.equal(false);
      expect(hunch.boxes).to.not.includes(box.id);
    });

  });

});

/**
 * Created on 13-Jul-18.
 */
const { Types: { ObjectId }} = require('mongoose');
const { generateBox, requester } = require('../../../helpers/api-integration.helper');

describe('PATCH /boxes/boxId', () => {

  it('cannot patch a non-existent box', async () => {
    const dummyId = ObjectId();

    await expect(requester().patch(`/boxes/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'boxNotFound'
    });
  });

  context('Updating a box', () => {
    let box;

    beforeEach(async () => {
      box = await generateBox();
    });

    it('updates a box', async () => {
      const updateBox = {
        title: 'New title',
        description: 'New description',
      };

      const res = await requester().patch(`/boxes/${box.id}`, updateBox);

      expect(res.title).to.equal(updateBox.title);
      expect(res.description).to.equal(updateBox.description);
    });

  });
});

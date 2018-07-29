/**
 * Created on 25-Jun-18.
 */
const { Types: { ObjectId }} = require('mongoose');
const { generateHunch, generateBox, requester } = require('../../../helpers/api-integration.helper');

describe('GET /hunches/hunchId/boxes', () => {

  it('cannot get boxes of a non-existent hunch', async () => {
    const dummyId = ObjectId();

    await expect(requester().get(`/hunches/${dummyId}/boxes`)).to.eventually.be.rejected.and.eql({
      status: 404,
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

    it('returns boxes of the hunch', async () => {
      const boxes = await requester().get(`/hunches/${hunch.id}/boxes`);
      expect(boxes.map(box => box.id)).to.eql(hunch.boxes.map(box => box.id));
    });

  });
});

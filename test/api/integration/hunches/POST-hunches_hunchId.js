/**
 * Created on 13-Jul-18.
 */
const { Types: { ObjectId }} = require('mongoose');
const { generateHunch, generateBox, requester } = require('../../../helpers/api-integration.helper');

describe('PATCH /hunches/hunchId', () => {

  it('cannot patch a non-existent hunch', async () => {
    const dummyId = ObjectId();

    await expect(requester().patch(`/hunches/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'hunchNotFound'
    });
  });

  context('Updating a hunch', () => {
    let currentBoxes = [];
    let updateBoxes = [];
    let hunch;

    beforeEach(async () => {
      // seed 2 boxes
      currentBoxes.push(await generateBox());
      currentBoxes.push(await generateBox());
      hunch = await generateHunch(currentBoxes);

      // create new 2 boxes to update
      updateBoxes.push(await generateBox());
      updateBoxes.push(await generateBox());
    });

    it('updates a hunch', async () => {
      const updateHunch = {
        wisdom: 'New wisdom',
        attribute: 'New attribute',
        boxes: updateBoxes.map(box => box.id)
      };

      const res = await requester().patch(`/hunches/${hunch.id}`, updateHunch);

      expect(res.wisdom).to.equal(updateHunch.wisdom);
      expect(res.attribute).to.equal(updateHunch.attribute);
      expect(res.boxes.map(box => box.id)).to.eql(updateHunch.boxes);
    });

  });
});

/**
 * Created on 13-Jul-18.
 */
const {Types: {ObjectId}} = require('mongoose');
const {generateHunch, generateBox, requester} = require('../../../helpers/api-integration.helper');

describe('POST /boxes/boxId/hunches', () => {

  it('cannot post a new `hunch` to a non-existent box', async () => {
    const dummyId = ObjectId();

    await expect(requester().post(`/boxes/${dummyId}/hunches`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'boxNotFound'
    });
  });

  context('Adding `hunches` into the `box`', () => {
    let box;
    let newHunch;

    beforeEach(async () => {
      box = await generateBox();

      const dummyBox = await generateBox();
      newHunch = await generateHunch(dummyBox);
    });

    it('adds new `hunches` into the `boxes`', async () => {
      const inputHunchId = newHunch.id;

      expect(box.hunches).to.be.empty;

      const res = await requester().post(`/boxes/${box.id}/hunches`, {hunches: [inputHunchId]});

      expect(res.hunches.map(hunch => hunch.id)).to.include(inputHunchId);
    });

    it('adds new `hunches` into the `box`, but not `hunches` that are already in the `box`', async () => {
      const hunchInBox = await generateHunch(box);

      const inputHunchIds = [newHunch.id, hunchInBox.id];

      await box.sync();
      expect(box.hunches).to.include(hunchInBox.id);

      const res = await requester().post(`/boxes/${box.id}/hunches`, {hunches: inputHunchIds});

      expect(res.hunches.map(hunch => hunch.id)).to.include(newHunch.id);
      expect(res.hunches.map(hunch => hunch.id)).to.not.include(hunchInBox.id);
    });

  });
});

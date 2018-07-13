/**
 * Created on 25-Jun-18.
 */
const { Types: { ObjectId }} = require('mongoose');
const { generateHunch, generateBox, requester } = require('../../../helpers/api-integration.helper');

describe('GET /boxes/boxId', () => {

  it('cannot get a non-existent box', async () => {
    const dummyId = ObjectId();

    await expect(requester().get(`/boxes/${dummyId}`)).to.eventually.be.rejected.and.eql({
      status: 404,
      message: 'boxNotFound'
    });
  });

  context('Success', () => {
    let box;
    let hunchIds = [];

    beforeEach(async () => {
      box = await generateBox();

      // seed a box with 2 hunches
      const [hunch1, hunch2] = await Promise.all([generateHunch(box), generateHunch(box)]);
      hunchIds.push(hunch1.id);
      hunchIds.push(hunch2.id);
    });

    it('returns box data', async () => {
      await box.sync();
      const _box = await requester().get(`/boxes/${box.id}`);

      expect(_box.id).to.equal(box.id);
      expect(_box.title).to.equal(box.title);
      expect(_box.description).to.equal(box.description);
      expect(_box.hunches).to.eql(hunchIds);
    });

  });
});

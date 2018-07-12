/**
 * Created on 25-Jun-18.
 */
require('../../../helpers/api-integration.helper');
const requester = require('../../../helpers/api-integration/requester');
const {generateBox} = require('../../../helpers/api-integration/object-generators');

describe('POST /hunches', () => {

  context('Validation Error', () => {

    it('requires `wisdom` and `boxes`', async () => {
      await expect(
        requester().post('/hunches', {
          attribute: 'attribute',
        })).to.eventually.be.rejected.and.eql({
        status: 422,
        message: 'invalidRequestParams',
        errors: [
          {
            field: "wisdom",
            message: "missingWisdom",
          },
          {
            field: "boxes",
            message: "missingBox",
          }
        ]
      });
    });

  });


  context('Success', () => {
    let box;

    beforeEach(async () => {
      box = await generateBox();
    });

    it('creates a hunch', async () => {
      const wisdom = 'Test wisdom';
      const attribute = 'Test attribute';

      const hunch = await requester().post('/hunches', {
        wisdom,
        attribute,
        boxes: [box.id]
      });

      expect(hunch.wisdom).to.equal(wisdom);
      expect(hunch.attribute).to.equal(attribute);
      expect(hunch.boxes[0].id).to.eql(box.id);
    });

  });

});

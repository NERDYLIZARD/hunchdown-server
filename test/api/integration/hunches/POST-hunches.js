/**
 * Created on 12-Jul-18.
 */
const { generateBox, requester } = require('../../../helpers/api-integration.helper');

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

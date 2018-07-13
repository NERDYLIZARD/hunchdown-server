/**
 * Created on 13-Jul-18.
 */
const { requester } = require('../../../helpers/api-integration.helper');

describe('POST /boxes', () => {

  context('Validation Error', () => {

    it('requires `title`', async () => {
      await expect(
        requester().post('/boxes', {
          description: 'A test description',
        })).to.eventually.be.rejected.and.eql({
        status: 422,
        message: 'invalidRequestParams',
        errors: [
          {
            field: "title",
            message: "missingTitle",
          }
        ]
      });
    });
  });


  context('Success', () => {

    it('creates a box', async () => {
      const title = 'A test title';
      const description = 'A test description';

      const box = await requester().post('/boxes', {
        title,
        description,
      });

      expect(box.title).to.equal(title);
      expect(box.description).to.equal(description);
    });

  });

});

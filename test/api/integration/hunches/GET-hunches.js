/**
 * Created on 25-Jun-18.
 */
require('../../../helpers/api-integration.helper');
const HunchDataFactory = require('../../../../utils/test/data-factories/HunchDataFactory');
const requester = require('../../../helpers/api-integration/requester');

const Hunch = require('../../../../models/hunch');
const hunchDataFactory = new HunchDataFactory();

before(async () => {
  // seed a hunch
  const hunch = new Hunch(hunchDataFactory.createObject());
  await hunch.save();
});

describe('GET /hunches', () => {

  const baseUrl = '/api/hunches';
  const api = requester();

  context('Success', () => {

    it('returns status 200', async () => {
      const response = await api.get(baseUrl);
      expect(response.status).to.eql(200);
    });

    it('returns header with `Link`, `X-Current-Page` and `X-Total-Pages`', async () => {
      const response = await api.get(baseUrl);

      expect(response.header.link).to.exist;

      expect(response.header['x-current-page']).to.exist;
      expect(response.header['x-current-page']).to.eql('1');

      expect(response.header['x-total-pages']).to.exist;
    });

    it('returns JSON array', async () => {
      const response = await api.get(baseUrl);
      expect(response.body).to.be.an('array');
    });

    it('returns object with correct props', async () => {
      const expectedProps = hunchDataFactory.getObjectProps();
      const response = await api.get(baseUrl);
      const sampleKeys = Object.keys(response.body[0]);

      expectedProps.forEach(key => expect(sampleKeys).to.include(key));
    });
  });
});
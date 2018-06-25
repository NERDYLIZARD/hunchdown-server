/**
 * Created on 25-Jun-18.
 */
require('../../../helpers/api-integration.helper');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../../app');
const HunchDataFactory = require('../../../../utils/test/data-factories/HunchDataFactory');

const Hunch = mongoose.model('Hunch');
const hunchDataFactory = new HunchDataFactory();
const baseUrl = '/api/hunches';

before(async () => {
  // seed a hunch
  const hunch = new Hunch(hunchDataFactory.createObject());
  await hunch.save();
});

describe('GET /hunches', () => {
  context('Success', () => {

    it('returns status 200', async () => {
      const response = await request(app).get(baseUrl);
      expect(response.status).to.eql(200);
    });

    it('returns header with `Link`, `X-Current-Page` and `X-Total-Pages`', async () => {
      const response = await request(app).get(baseUrl);

      expect(response.header.link).to.not.be.undefined;

      expect(response.header['x-current-page']).to.not.be.undefined;
      expect(response.header['x-current-page']).to.eql('1');

      expect(response.header['x-total-pages']).to.not.be.undefined;
    });

    it('returns JSON array', async () => {
      const response = await request(app).get(baseUrl);
      expect(response.body).to.be.an('array');
    });

    it('returns object with correct props', async () => {
      const expectedProps = hunchDataFactory.getObjectProps();
      const response = await request(app).get(baseUrl);
      const sampleKeys = Object.keys(response.body[0]);

      expectedProps.forEach(key => expect(sampleKeys).to.include(key));
    });
  });
});
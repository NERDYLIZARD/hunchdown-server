/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const baseUrl = '/api/cards';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await mockgoose.prepareStorage();
  return mongoose.connect(process.env.MONGODB_URI);
});


afterAll(async () => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  await mockgoose.helper.reset();
  return mongoose.disconnect();
});

describe('Cards routes', () => {

  describe('GET /cards', () => {

    it('should response the GET method', async () => {
      const response = await request(app).get(baseUrl);
      expect(response.statusCode).toBe(200);
    });

    it('Post method', async () => {
      const card = {
        wisdom: 'mockgoose',
        attribute: 'foo'
      };
      const response = await request(app)
        .post(baseUrl)
        .send(card);
    });

  });
});
/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const { connectDatabase, disconnectDatabase } = require('../../utils/testHelper');

const baseUrl = '/api/cards';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  connectDatabase();
});

afterAll(async () => {
  disconnectDatabase();
});

describe('Cards routes', () => {

  describe('GET /cards', () => {

    const expectedProps = ['_id', 'wisdom', 'attribute'];

    it('should return status 200', async () => {
      const response = await request(app).get(baseUrl);
      expect(response.statusCode).toBe(200);
    });

    it('should return JSON array', async () => {
      const response = await request(app).get(baseUrl);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return object with correct props', async () => {
      const response = await request(app).get(baseUrl);
      const sampleKeys = Object.keys(response.body[0]);
      expectedProps.forEach(key => expect(sampleKeys).toContain(key));
    });

  });


});
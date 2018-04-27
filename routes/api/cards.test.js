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
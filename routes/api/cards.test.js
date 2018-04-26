/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');

const baseUrl = '/api/cards';

describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    const response = await request(app).get(`${baseUrl}/test`);
    expect(response.statusCode).toBe(200);
  });
});
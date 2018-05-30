/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const { connectDatabase, disconnectDatabase } = require('../../utils/test/testHelper');
const BoxDataFactory = require('../../utils/test/data-factories/BoxDataFactory');
const ValidationErrorDataFactory = require('../../utils/test/data-factories/ValidationErrorDataFactory');

const Box = require('../../models/Box');
const baseUrl = '/api/boxes';
const boxDataFactory = new BoxDataFactory();
const validationErrorDataFactory = new ValidationErrorDataFactory();

jest.setTimeout(100000); // 100 second timeout


beforeAll(async () => {
  await connectDatabase();
  // seed a box
  const box = new Box(boxDataFactory.createObject());
  await box.save();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('Boxes routes', () => {

  describe('POST /boxes', () => {
    describe('Success', () => {

      it('returns status 201', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(boxDataFactory.createObject());
        expect(response.status).toBe(201);
      });

      it('returns Location header', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(boxDataFactory.createObject());
        expect(response.header.location).toBeDefined();
        expect(typeof response.header.location).toBe('string');
      });

      it('returns a box as resource object', async () => {
        const box = boxDataFactory.createObject();
        const response = await request(app)
          .post(baseUrl)
          .send(box);
        expect(response.body.title).toBe(box.title);
        expect(response.body.description).toBe(box.description);
      });
    });

    describe('ValidationError', () => {

      const box = boxDataFactory.createObjectWithOut('title');

      it('returns status 422', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(box);
        expect(response.status).toBe(422);
      });

      it('returns array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorDataFactory.getObjectProps();
        const response = await request(app)
          .post(baseUrl)
          .send(box);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });
  });

});

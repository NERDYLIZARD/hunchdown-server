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

  describe('GET /boxes', () => {
    describe('Success', () => {

      it('returns status 200', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.status).toBe(200);
      });

      it('returns header with `Link`, `X-Current-Page` and `X-Total-Pages`', async () => {
        const response = await request(app).get(baseUrl);

        expect(response.header.link).toBeDefined();

        expect(response.header['x-current-page']).toBeDefined();
        expect(response.header['x-current-page']).toBe('1');

        expect(response.header['x-total-pages']).toBeDefined();
      });

      it('returns JSON array', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.body).toBeInstanceOf(Array);
      });

      it('returns object with correct props', async () => {
        const expectedProps = boxDataFactory.getObjectProps();
        const response = await request(app).get(baseUrl);
        const sampleKeys = Object.keys(response.body[0]);
        expectedProps.forEach(key => expect(sampleKeys).toContain(key));
      });

    });
  });


  describe('GET /boxes/:box', () => {

    let box;
    beforeAll(async () => {
      // post one box
      const response = await request(app)
        .post(baseUrl)
        .send(boxDataFactory.createObject());
      box = response.body;
    });

    it('returns status 200', async () => {
      const response = await request(app).get(`${baseUrl}/${box.id}`);
      expect(response.status).toBe(200);
    });

    it('returns a box as resource object', async () => {
      const response = await request(app).get(`${baseUrl}/${box.id}`);
      expect(response.body).toEqual(box);
    });

    it('returns response 404 when no box found', async () => {
      const response = await request(app).get(`${baseUrl}/noMatchingId`);
      expect(response.status).toBe(404);
    });
  });


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


  describe('PATCH /boxes/:box', () => {

    let box;

    beforeAll(async () => {
      // post one box
      const response = await request(app)
        .post(baseUrl)
        .send(boxDataFactory.createObject());
      box = response.body;
    });

    describe('Success', () => {

      const updatingBox = boxDataFactory.createObject();
      updatingBox.title = 'theUpdate';

      it('returns status 200', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${box.id}`)
          .send(updatingBox);
        expect(response.status).toBe(200);
      });

      it('returns an updated box as resource object', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${box.id}`)
          .send(updatingBox);
        expect(response.body.title).toBe(updatingBox.title);
        expect(response.body.description).toBe(updatingBox.description);
      });
    });

    describe('ValidationError', () => {

      const updatingBox = boxDataFactory.createObjectWithOut('title');

      it('returns status 422', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${box.id}`)
          .send(updatingBox);
        expect(response.status).toBe(422);
      });

      it('returns array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorDataFactory.getObjectProps();
        const response = await request(app)
          .patch(`${baseUrl}/${box.id}`)
          .send(updatingBox);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });

    describe('Not Found', () => {
      it('returns status 404', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/noMatchingId`)
          .send(boxDataFactory.createObject());
        expect(response.status).toBe(404);
      });
    });
  });

});

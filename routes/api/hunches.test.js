/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const { connectDatabase, disconnectDatabase } = require('../../utils/test/helpers');
const HunchDataFactory = require('../../utils/test/data-factories/HunchDataFactory');
const ValidationErrorDataFactory = require('../../utils/test/data-factories/ValidationErrorDataFactory');

const Hunch = require('../../models/Hunch');
const baseUrl = '/api/hunches';
const hunchDataFactory = new HunchDataFactory();
const validationErrorDataFactory = new ValidationErrorDataFactory();

jest.setTimeout(100000); // 100 second timeout

const postHunch = async () => {
  const response = await request(app)
    .post(baseUrl)
    .send(hunchDataFactory.createObject());
  return response.body;
};

beforeAll(async () => {
  await connectDatabase();
  // seed a hunch
  const hunch = new Hunch(hunchDataFactory.createObject());
  await hunch.save();
});


afterAll(async () => {
  await disconnectDatabase();
});

describe('Hunches routes', () => {

  describe('GET /hunches', () => {
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
        const expectedProps = hunchDataFactory.getObjectProps();
        const response = await request(app).get(baseUrl);
        const sampleKeys = Object.keys(response.body[0]);
        expectedProps.forEach(key => expect(sampleKeys).toContain(key));
      });

    });
  });


  describe('GET /hunches/:hunch', () => {

    let hunch;
    beforeAll(async () => {
      // post one hunch
      hunch = await postHunch();
    });

    it('returns status 200', async () => {
      const response = await request(app).get(`${baseUrl}/${hunch.id}`);
      expect(response.status).toBe(200);
    });

    it('returns a hunch as resource object', async () => {
      const response = await request(app).get(`${baseUrl}/${hunch.id}`);
      expect(response.body).toEqual(hunch);
    });

    it('returns response 404 when no hunch found', async () => {
      const response = await request(app).get(`${baseUrl}/noMatchingId`);
      expect(response.status).toBe(404);
    });
  });


  describe('POST /hunches', () => {
    describe('Success', () => {

      it('returns status 201', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(hunchDataFactory.createObject());
        expect(response.status).toBe(201);
      });

      it('returns Location header', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(hunchDataFactory.createObject());
        expect(response.header.location).toBeDefined();
        expect(typeof response.header.location).toBe('string');
      });

      it('returns a hunch as resource object', async () => {
        const hunch = hunchDataFactory.createObject();
        const response = await request(app)
          .post(baseUrl)
          .send(hunch);
        expect(response.body.wisdom).toBe(hunch.wisdom);
        expect(response.body.attribute).toBe(hunch.attribute);
      });
    });

    describe('ValidationError', () => {

      const hunch = hunchDataFactory.createObjectWithOut('wisdom');

      it('returns status 422', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(hunch);
        expect(response.status).toBe(422);
      });

      it('returns array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorDataFactory.getObjectProps();
        const response = await request(app)
          .post(baseUrl)
          .send(hunch);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });
  });


  describe('PATCH /hunches/:hunch', () => {

    let hunch;

    beforeAll(async () => {
      hunch = await postHunch();
    });

    describe('Success', () => {

      const updatingHunch = hunchDataFactory.createObject();
      updatingHunch.wisdom = 'theUpdate';

      it('returns status 200', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${hunch.id}`)
          .send(updatingHunch);
        expect(response.status).toBe(200);
      });

      it('returns an updated hunch as resource object', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${hunch.id}`)
          .send(updatingHunch);
        expect(response.body.wisdom).toBe(updatingHunch.wisdom);
        expect(response.body.attribute).toBe(updatingHunch.attribute);
      });
    });

    describe('ValidationError', () => {

      const updatingHunch = hunchDataFactory.createObjectWithOut('wisdom');

      it('returns status 422', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${hunch.id}`)
          .send(updatingHunch);
        expect(response.status).toBe(422);
      });

      it('returns array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorDataFactory.getObjectProps();
        const response = await request(app)
          .patch(`${baseUrl}/${hunch.id}`)
          .send(updatingHunch);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });

    describe('Not Found', () => {
      it('returns status 404', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/noMatchingId`)
          .send(hunchDataFactory.createObject());
        expect(response.status).toBe(404);
      });
    });
  });


  describe('DELETE /hunches/:hunch', () => {

    let hunch;
    beforeAll(async () => {
      hunch = await postHunch();
    });

    it('returns status 204 on success', async () => {
      const response = await request(app).delete(`${baseUrl}/${hunch.id}`);
      expect(response.status).toBe(204);
    });

    it('returns status 404 when no hunch Found', async () => {
      const response = await request(app).delete(`${baseUrl}/${hunch.id}`);
      expect(response.status).toBe(404);
    });
  });

});

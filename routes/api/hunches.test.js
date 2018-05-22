/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const { mongoose, connectDatabase, disconnectDatabase } = require('../../utils/test/testHelper');
const HunchSampleData = require('../../utils/test/sampleData/HunchSampleData');
const ValidationErrorSampleData = require('../../utils/test/sampleData/ValidationErrorSampleData');

const Hunch = mongoose.model('Hunch');
const baseUrl = '/api/hunches';
const hunchSampleData = new HunchSampleData();
const validationErrorSampleData = new ValidationErrorSampleData();

jest.setTimeout(100000); // 100 second timeout


beforeAll(async () => {
  await connectDatabase();
  // seed a hunch
  const hunch = new Hunch(hunchSampleData.createObject());
  await hunch.save();
});


afterAll(async () => {
  await disconnectDatabase();
});

describe('Hunches routes', () => {

  describe('GET /hunches', () => {
    describe('Success', () => {

      it('should return status 200', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.status).toBe(200);
      });

      it('should return Link header', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.header.link).toBeDefined();
      });

      it('should return X-Current-Page header', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.header['x-current-page']).toBeDefined();
        expect(response.header['x-current-page']).toBe('1');
      });

      it('should return X-Total-Pages header', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.header['x-total-pages']).toBeDefined();
      });

      it('should return JSON array', async () => {
        const response = await request(app).get(baseUrl);
        expect(response.body).toBeInstanceOf(Array);
      });

      it('should return object with correct props', async () => {
        const expectedProps = hunchSampleData.getObjectProps();
        const response = await request(app).get(baseUrl);
        const sampleKeys = Object.keys(response.body[0]);
        expectedProps.forEach(key => expect(sampleKeys).toContain(key));
      });

    });
  });


  describe('POST /hunches', () => {
    describe('Success', () => {

      it('should return status 201', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(hunchSampleData.createObject());
        expect(response.status).toBe(201);
      });

      it('should return Location header', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(hunchSampleData.createObject());
        expect(response.header.location).toBeDefined();
        expect(typeof response.header.location).toBe('string');
      });

      it('should return a hunch as resource object', async () => {
        const hunch = hunchSampleData.createObject();
        const response = await request(app)
          .post(baseUrl)
          .send(hunch);
        expect(response.body.wisdom).toBe(hunch.wisdom);
        expect(response.body.attribute).toBe(hunch.attribute);
      });
    });

    describe('ValidationError', () => {

      const hunch = hunchSampleData.createObjectWithOut('wisdom');

      it('should return status 422', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(hunch);
        expect(response.status).toBe(422);
      });

      it('should return array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorSampleData.getObjectProps();
        const response = await request(app)
          .post(baseUrl)
          .send(hunch);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });
  });


  describe('GET /hunches/:hunch', () => {

    let hunch = null;
    beforeAll(async () => {
      // post one hunch
      const response = await request(app)
        .post(baseUrl)
        .send(hunchSampleData.createObject());
      hunch = response.body;
    });

    it('should return status 200', async () => {
      const response = await request(app).get(`${baseUrl}/${hunch._id}`);
      expect(response.status).toBe(200);
    });

    it('should return a hunch as resource object', async () => {
      const response = await request(app).get(`${baseUrl}/${hunch._id}`);
      expect(response.body).toEqual(hunch);
    });

    it('should return response 404 when no hunch found', async () => {
      const response = await request(app).get(`${baseUrl}/noMatchingId`);
      expect(response.status).toBe(404);
    });
  });


  describe('PATCH /hunches/:hunch', () => {

    let hunch = null;

    beforeAll(async () => {
      // post one hunch
      const response = await request(app)
        .post(baseUrl)
        .send(hunchSampleData.createObject());
      hunch = response.body;
    });

    describe('Success', () => {

      const updatingHunch = hunchSampleData.createObject();
      updatingHunch.wisdom = 'theUpdate';

      it('should return status 200', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${hunch._id}`)
          .send(updatingHunch);
        expect(response.status).toBe(200);
      });

      it('should return an updated hunch as resource object', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${hunch._id}`)
          .send(updatingHunch);
        expect(response.body.wisdom).toBe(updatingHunch.wisdom);
        expect(response.body.attribute).toBe(updatingHunch.attribute);
      });
    });

    describe('ValidationError', () => {

      const updatingHunch = hunchSampleData.createObjectWithOut('wisdom');

      it('should return status 422', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${hunch._id}`)
          .send(updatingHunch);
        expect(response.status).toBe(422);
      });

      it('should return array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorSampleData.getObjectProps();
        const response = await request(app)
          .patch(`${baseUrl}/${hunch._id}`)
          .send(updatingHunch);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });

    describe('Not Found', () => {
      it('should return status 404', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/noMatchingId`)
          .send(hunchSampleData.createObject());
        expect(response.status).toBe(404);
      });
    });
  });


  describe('DELETE /hunches/:hunch', () => {

    let hunch = null;
    beforeAll(async () => {
      // post one hunch
      const response = await request(app)
        .post(baseUrl)
        .send(hunchSampleData.createObject());
      hunch = response.body;
    });

    it('should return status 204 on success', async () => {
      const response = await request(app).delete(`${baseUrl}/${hunch._id}`);
      expect(response.status).toBe(204);
    });

    it('should return status 404 when no hunch Found', async () => {
      const response = await request(app).delete(`${baseUrl}/${hunch._id}`);
      expect(response.status).toBe(404);
    });
  });

});

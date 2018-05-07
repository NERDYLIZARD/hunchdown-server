/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const { mongoose, connectDatabase, disconnectDatabase } = require('../../utils/test/testHelper');
const CardSampleData = require('../../utils/test/sampleData/CardSampleData');
const ValidationErrorSampleData = require('../../utils/test/sampleData/ValidationErrorSampleData');

const Card = mongoose.model('Card');
const baseUrl = '/api/cards';
const cardSampleData = new CardSampleData();
const validationErrorSampleData = new ValidationErrorSampleData();

jest.setTimeout(100000); // 100 second timeout


beforeAll(async () => {
  await connectDatabase();
  // seed a card
  const card = new Card(cardSampleData.createObject());
  await card.save();
});


afterAll(async () => {
  await disconnectDatabase();
});

describe('Cards routes', () => {

  describe('GET /cards', () => {
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
        const expectedProps = cardSampleData.getObjectProps();
        const response = await request(app).get(baseUrl);
        const sampleKeys = Object.keys(response.body[0]);
        expectedProps.forEach(key => expect(sampleKeys).toContain(key));
      });

    });
  });


  describe('POST /cards', () => {
    describe('Success', () => {

      it('should return status 201', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(cardSampleData.createObject());
        expect(response.status).toBe(201);
      });

      it('should return Location header', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(cardSampleData.createObject());
        expect(response.header.location).toBeDefined();
        expect(typeof response.header.location).toBe('string');
      });

      it('should return a card as resource object', async () => {
        const card = cardSampleData.createObject();
        const response = await request(app)
          .post(baseUrl)
          .send(card);
        expect(response.body.wisdom).toBe(card.wisdom);
        expect(response.body.attribute).toBe(card.attribute);
      });
    });

    describe('ValidationError', () => {

      const card = cardSampleData.createObjectWithOut('wisdom');

      it('should return status 422', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(card);
        expect(response.status).toBe(422);
      });

      it('should return array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorSampleData.getObjectProps();
        const response = await request(app)
          .post(baseUrl)
          .send(card);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });
  });


  describe('GET /cards/:card', () => {

    let card = null;
    beforeAll(async () => {
      // post one card
      const response = await request(app)
        .post(baseUrl)
        .send(cardSampleData.createObject());
      card = response.body;
    });

    it('should return status 200', async () => {
      const response = await request(app).get(`${baseUrl}/${card._id}`);
      expect(response.status).toBe(200);
    });

    it('should return a card as resource object', async () => {
      const response = await request(app).get(`${baseUrl}/${card._id}`);
      expect(response.body).toEqual(card);
    });

    it('should return response 404 when no card found', async () => {
      const response = await request(app).get(`${baseUrl}/noMatchingId`);
      expect(response.status).toBe(404);
    });
  });


  describe('PATCH /cards/:card', () => {

    let card = null;

    beforeAll(async () => {
      // post one card
      const response = await request(app)
        .post(baseUrl)
        .send(cardSampleData.createObject());
      card = response.body;
    });

    describe('Success', () => {

      const updatingCard = cardSampleData.createObject();
      updatingCard.wisdom = 'theUpdate';

      it('should return status 200', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${card._id}`)
          .send(updatingCard);
        expect(response.status).toBe(200);
      });

      it('should return an updated card as resource object', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${card._id}`)
          .send(updatingCard);
        expect(response.body.wisdom).toBe(updatingCard.wisdom);
        expect(response.body.attribute).toBe(updatingCard.attribute);
      });
    });

    describe('ValidationError', () => {

      const updatingCard = cardSampleData.createObjectWithOut('wisdom');

      it('should return status 422', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/${card._id}`)
          .send(updatingCard);
        expect(response.status).toBe(422);
      });

      it('should return array of errors[] and each error has correct props', async () => {
        const errorProps = validationErrorSampleData.getObjectProps();
        const response = await request(app)
          .patch(`${baseUrl}/${card._id}`)
          .send(updatingCard);
        const sampleErrorProps = Object.keys(response.body.errors[0]);
        expect(response.body.errors).toBeInstanceOf(Array);
        errorProps.forEach(prop => expect(sampleErrorProps).toContain(prop));
      });
    });

    describe('Not Found', () => {
      it('should return status 404', async () => {
        const response = await request(app)
          .patch(`${baseUrl}/noMatchingId`)
          .send(cardSampleData.createObject());
        expect(response.status).toBe(404);
      });
    });
  });


  describe('DELETE /cards/:card', () => {

    let card = null;
    beforeAll(async () => {
      // post one card
      const response = await request(app)
        .post(baseUrl)
        .send(cardSampleData.createObject());
      card = response.body;
    });

    it('should return status 204 on success', async () => {
      const response = await request(app).delete(`${baseUrl}/${card._id}`);
      expect(response.status).toBe(204);
    });

    it('should return status 404 when no card Found', async () => {
      const response = await request(app).delete(`${baseUrl}/${card._id}`);
      expect(response.status).toBe(404);
    });
  });

});

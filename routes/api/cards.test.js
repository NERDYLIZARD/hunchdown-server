/**
 * Created on 26-Apr-18.
 */
const request = require('supertest');
const app = require('../../app');
const { mongoose, connectDatabase, disconnectDatabase, getCardProps, getValidationErrorProps } = require('../../utils/testHelper');

const Card = mongoose.model('Card');
const baseUrl = '/api/cards';

jest.setTimeout(100000); // 100 second timeout

function createCardObject() {
  return {
    wisdom: 'foo',
    attribute: 'bar',
  }
}

function createCardObjectWithInvalid(key, value) {
  const card = createCardObject();
  card[key] = value;
  return card;
}

function createCardObjectWithOut(prop) {
  const card = createCardObject();
  delete card[prop];
  return card;
}

beforeAll(async () => {
  await connectDatabase();
  // create one card
  let card = new Card(createCardObject());
  card = await card.save();
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
        const expectedProps = getCardProps();
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
          .send(createCardObject());
        expect(response.status).toBe(201);
      });

      it('should return Location header', async () => {
        const response = await request(app)
          .post(baseUrl)
          .send(createCardObject());
        expect(response.header.location).toBeDefined();
        expect(typeof response.header.location).toBe('string');
      });

      it('should return a card as resource object', async () => {
        const card = createCardObject();
        const response = await request(app)
          .post(baseUrl)
          .send(card);
        expect(response.body.wisdom).toBe(card.wisdom);
        expect(response.body.attribute).toBe(card.attribute);
      });
    });

    describe('ValidationError', () => {

      it('should return status 422', async () => {
        const card = createCardObjectWithOut('wisdom');
        const response = await request(app)
          .post(baseUrl)
          .send(card);
        expect(response.status).toBe(422);
        expect(response.body.errors).toBeInstanceOf(Array);
      });

      it('should return array of errors[] and each error has correct props', async () => {
        const errorProps = getValidationErrorProps();
        const card = createCardObjectWithOut('wisdom');
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
        .send(createCardObject());
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

});

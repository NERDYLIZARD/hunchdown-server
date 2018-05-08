/**
 * Created on 08-May-18.
 */
  // "require" instead of "mongoose.model" because there is no model registration since we don't want to connect to the database
const Card = require('./Card');
const CardSampleData = require('../utils/test/sampleData/CardSampleData');

const cardSampleData = new CardSampleData();

describe('Card Model', () => {

  describe('Validation', () => {

    it('should return validation failed on card without wisdom', () => {
      const card = new Card(cardSampleData.createObjectWithOut('wisdom'));
      return card.validate()
        .catch(error => {
          expect(error.errors.wisdom).toBeDefined();
          expect(error.errors.wisdom.kind).toBe('required');
        });
    });

    it('should return castError on card with invalid wisdom', () => {
      const card = new Card(cardSampleData.createObjectWithInvalid('wisdom', 123));
      return card.validate()
        .catch(error => {
          expect(error.errors.wisdom).toBeDefined();
          expect(error.errors.wisdom.name).toBe('CastError');
        });
    });

    it('should return castError on card with invalid attribute', () => {
      const card = new Card(cardSampleData.createObjectWithInvalid('attribute', 123));
      return card.validate()
        .catch(error => {
          expect(error.errors.attribute).toBeDefined();
          expect(error.errors.attribute.name).toBe('CastError');
        });
    });
  });

});
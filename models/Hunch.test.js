/**
 * Created on 08-May-18.
 */
  // "require" instead of "mongoose.model" because there is no model registration since we don't want to connect to the database
const Hunch = require('./Hunch');
const HunchSampleData = require('../utils/test/sampleData/HunchSampleData');

const hunchSampleData = new HunchSampleData();

describe('Hunch Model', () => {

  describe('Validation', () => {

    it('should return validation failed on hunch without wisdom', () => {
      const hunch = new Hunch(hunchSampleData.createObjectWithOut('wisdom'));
      return hunch.validate()
        .catch(error => {
          expect(error.errors.wisdom).toBeDefined();
          expect(error.errors.wisdom.kind).toBe('required');
        });
    });

    it('should return castError on hunch with invalid wisdom', () => {
      const hunch = new Hunch(hunchSampleData.createObjectWithInvalid('wisdom', 123));
      return hunch.validate()
        .catch(error => {
          expect(error.errors.wisdom).toBeDefined();
          expect(error.errors.wisdom.name).toBe('CastError');
        });
    });

    it('should return castError on hunch with invalid attribute', () => {
      const hunch = new Hunch(hunchSampleData.createObjectWithInvalid('attribute', 123));
      return hunch.validate()
        .catch(error => {
          expect(error.errors.attribute).toBeDefined();
          expect(error.errors.attribute.name).toBe('CastError');
        });
    });
  });

});
/**
 * Created on 08-May-18.
 */
const Hunch = require('./Hunch');
const HunchSampleData = require('../utils/test/sampleData/HunchSampleData');

const hunchSampleData = new HunchSampleData();

const omitArticles = require('../utils/omitArticles');
jest.mock('../utils/omitArticles', () => jest.fn(str => str));

describe('Hunch Model', () => {
  /**
   * Middlewares
   */
  describe('Middlewares', () => {

    describe('`generateSlug()`', () => {
      let hunch;
      let generateSlug;
      const next = jest.fn();

      beforeEach(() => {
        hunch = new Hunch(hunchSampleData.createObject());
        generateSlug = Hunch.middlewares.generateSlug.bind(hunch);
        jest.spyOn(hunch, 'slugify');
      });

      it('always calls next()', () => {
        hunch.slug = undefined;
        generateSlug(next);
        expect(next).toBeCalled();
      });

      describe('when `slug` is undefined', () => {
        it('calls `slugify()`', () => {
          hunch.slug = undefined;
          generateSlug(next);
          expect(hunch.slugify).toBeCalled();
        });
      });

      describe('when `slug` is defined', () => {
        it('does not call `slugify()`', () => {
          hunch.slug = 'defined';
          generateSlug(next);
          expect(hunch.slugify).not.toBeCalled();
        });
      });

    });
  });


  describe('methods', () => {
    describe('`slugify()`', () => {
      const hunch = new Hunch(hunchSampleData.createObject());

      it('calls `omitArticles()`', () => {
        hunch.slugify();
        expect(omitArticles).toBeCalled();
      });
    });
  });


});
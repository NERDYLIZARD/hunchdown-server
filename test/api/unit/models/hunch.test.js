/**
 * Created on 08-May-18.
 */
const Hunch = require('../../../../models/hunch');
const HunchDataFactory = require('../utils/test/data-factories/HunchDataFactory');

const hunchDataFactory = new HunchDataFactory();


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
        hunch = new Hunch(hunchDataFactory.createObject());
        generateSlug = Hunch.middlewares.generateSlug.bind(hunch);
        jest.spyOn(hunch, 'slugify');
      });

      it('always calls next()', () => {
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


  /**
   * Instance Methods
   */
  describe('Hunch Instance Methods', () => {

    describe('`slugify()`', () => {

      beforeAll(() => {
        jest.mock('../utils/omit-articles', () => jest.fn(str => str));
        jest.mock('slug', () => jest.fn());
      });

      afterAll(() => {
        jest.unmock('../utils/omit-articles');
        jest.unmock('slug');
      });

      describe('when `wisdom` is defined', () => {

        it('calls `omitArticles()` and `slug()`', () => {
          jest.resetModules();

          const omitArticles = require('../../../../libs/omit-articles');
          const slug = require('slug');

          const Hunch = require('../../../../models/hunch');
          const hunch = new Hunch(hunchDataFactory.createObject());

          hunch.slugify();
          expect(omitArticles).toBeCalled();
          expect(slug).toBeCalled();
        });
      });

      describe('when `wisdom` is not defined', () => {

        it('returns immediately', () => {
          jest.resetModules();

          const omitArticles = require('../../../../libs/omit-articles');
          const slug = require('slug');

          const Hunch = require('../../../../models/hunch');
          const hunch = new Hunch(hunchDataFactory.createObjectWithOut('wisdom'));

          hunch.slugify();
          expect(omitArticles).not.toBeCalled();
          expect(slug).not.toBeCalled();
        });
      });

    });

  });

});



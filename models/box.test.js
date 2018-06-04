/**
 * Created on 29-May-18.
 */
const Box = require('./box');
const BoxDataFactory = require('../utils/test/data-factories/BoxDataFactory');

const boxDataFactory = new BoxDataFactory();


describe('Box Model', () => {
  /**
   * Middlewares
   */
  describe('Middlewares', () => {

    describe('`generateSlug()`', () => {
      let box;
      let generateSlug;
      const next = jest.fn();

      beforeEach(() => {
        box = new Box(boxDataFactory.createObject());
        generateSlug = Box.middlewares.generateSlug.bind(box);
        jest.spyOn(box, 'slugify');
      });

      it('always calls next()', () => {
        box.slug = undefined;
        generateSlug(next);
        expect(next).toBeCalled();
      });

      describe('when `slug` is undefined', () => {
        it('calls `slugify()`', () => {
          box.slug = undefined;
          generateSlug(next);
          expect(box.slugify).toBeCalled();
        });
      });

      describe('when `slug` is defined', () => {
        it('does not call `slugify()`', () => {
          box.slug = 'defined';
          generateSlug(next);
          expect(box.slugify).not.toBeCalled();
        });
      });

    });
  });



});
/**
 * Created on 28-Apr-18.
 */
const faker = require('faker');
const DataFactory = require('./DataFactory');

class BoxDataFactory extends DataFactory {
  constructor() {
    super({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
    });
  }
}

module.exports = BoxDataFactory;

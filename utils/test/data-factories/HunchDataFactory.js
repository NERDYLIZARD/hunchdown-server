/**
 * Created on 28-Apr-18.
 */
const faker = require('faker');
const DataFactory = require('./DataFactory');

class HunchDataFactory extends DataFactory {
  constructor() {
    super({
      wisdom: faker.lorem.sentences(),
      attribute: faker.name.findName(),
    });
  }
}

module.exports = HunchDataFactory;

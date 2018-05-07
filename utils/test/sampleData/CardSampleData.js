/**
 * Created on 28-Apr-18.
 */
const SampleData = require('./SampleData');

class CardSampleData extends SampleData {
  constructor() {
    super({
      wisdom: 'foo',
      attribute: 'bar',
    });
  }
}

module.exports = CardSampleData;

/**
 * Created on 28-Apr-18.
 */
const SampleData = require('./SampleData');

class HunchSampleData extends SampleData {
  constructor() {
    super({
      wisdom: 'foo',
      attribute: 'bar',
    });
  }
}

module.exports = HunchSampleData;

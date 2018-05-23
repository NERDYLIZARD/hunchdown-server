/**
 * Created on 28-Apr-18.
 */
const SampleData = require('./SampleData');

class HunchSampleData extends SampleData {
  constructor() {
    super({
      wisdom: 'After reading a book, forget everything but the messages that you can apply to your life.',
      attribute: 'Sithideth Bouasavanh',
    });
  }
}

module.exports = HunchSampleData;

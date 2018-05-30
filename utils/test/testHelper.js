/**
 * Created on 27-Apr-18.
 */
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;

// allow parallel tests on mockgoose
Mockgoose.prototype.prepareStorage = function() {
  const _this = this;
  return new Promise(function(resolve, reject) {
    Promise.all([_this.getTempDBPath(), _this.getOpenPort()]).then(promiseValues => {
      const dbPath = promiseValues[0];
      const openPort = promiseValues[1].toString();
      const storageEngine = _this.getMemoryStorageName();
      const mongodArgs = ['--port', openPort, '--storageEngine', storageEngine, '--dbpath', dbPath];
      _this.mongodHelper.mongoBin.commandArguments = mongodArgs;
      const mockConnection = () => {
        _this.mockConnectCalls(_this.getMockConnectionString(openPort));
        resolve();
      };
      _this.mongodHelper.run().then(mockConnection).catch(mockConnection);
    });
  });
};

const mockgoose = new Mockgoose(mongoose);

module.exports = {

  mongoose,

  connectDatabase: async () => {
    await mockgoose.prepareStorage();
    await mongoose.connect('test');
  },

  disconnectDatabase: async () => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await mockgoose.helper.reset();
    await mongoose.disconnect();
  },

};

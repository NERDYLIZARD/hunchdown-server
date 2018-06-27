/**
 * Created on 27-Apr-18.
 */
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;

// allow parallel tests on mockgoose
Mockgoose.prototype.prepareStorage = function () {
  const _this = this;
  return new Promise(function (resolve, reject) {
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

module.exports.connectDatabase = async function () {
  try {
    await mockgoose.prepareStorage();
    await mongoose.connect('localhost:27017/hunchdown-test');
  } catch (e) {
    throw e;
  }
};

module.exports.disconnectDatabase = async function () {
  try {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await mockgoose.helper.reset();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (e) {
    throw e;
  }
};


module.exports.updateDocument = async function (collectionName, doc, update) {
  let collection = mongoose.connection.db.collection(collectionName);

  return new Promise((resolve) => {
    collection.updateOne({ _id: doc._id }, { $set: update }, (updateErr) => {
      if (updateErr) throw new Error(`Error updating ${collectionName}: ${updateErr}`);
      resolve();
    });
  });
};

module.exports.getDocument = async function (collectionName, doc) {
  let collection = mongoose.connection.db.collection(collectionName);

  return new Promise((resolve) => {
    collection.findOne({ _id: doc._id }, (lookupErr, found) => {
      if (lookupErr) throw new Error(`Error looking up ${collectionName}: ${lookupErr}`);
      resolve(found);
    });
  });
};


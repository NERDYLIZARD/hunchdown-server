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
    await mongoose.connect('mongodb://localhost:27017/test');
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

// Useful for checking things that have been deleted,
// but you no longer have access to
module.exports.checkExistence = async function (modelName, id) {
  return new Promise((resolve, reject) => {
    mongoose.model(modelName).find({_id: id}, {_id: 1}).limit(1).exec((findError, docs) => {
      if (findError) return reject(findError);

      const exists = docs.length > 0;

      resolve(exists);
    });
  });
};

module.exports.updateDocument = async function (modelName, doc, update) {
  return new Promise((resolve) => {
    mongoose.model(modelName).updateOne({_id: doc.id}, {$set: update}, (updateErr) => {
      if (updateErr) throw new Error(`Error updating ${modelName}: ${updateErr}`);
      resolve();
    });
  });
};

module.exports.getDocument = async function (modelName, doc) {
  return new Promise((resolve) => {
    mongoose.model(modelName).findOne({_id: doc.id}, (lookupErr, found) => {
      if (lookupErr) throw new Error(`Error looking up ${modelName}: ${lookupErr}`);
      resolve(found._doc);
    });
  });
};


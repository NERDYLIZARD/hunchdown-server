/**
 * Created on 27-Apr-18.
 */
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

async function connectDatabase() {
  await mockgoose.prepareStorage();
  await mongoose.connect(process.env.MONGODB_URI);
}

async function disconnectDatabase() {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  await mockgoose.helper.reset();
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase, mongoose };
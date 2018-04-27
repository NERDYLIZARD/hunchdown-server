/**
 * Created on 27-Apr-18.
 */
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

module.exports = {

  mongoose,

  connectDatabase: async () => {
    await mockgoose.prepareStorage();
    await mongoose.connect(process.env.MONGODB_URI);
  },

  disconnectDatabase: async () => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await mockgoose.helper.reset();
    await mongoose.disconnect();
  },

  getCardProps: () => (['_id', 'wisdom', 'attribute']),

  getValidationErrorProps: () => (['code', 'message', 'field', 'resource']),

};

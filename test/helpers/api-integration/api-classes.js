/* eslint-disable no-use-before-define */
const requester = require('./requester');
const mongoHelper = require('../mongo');

const getDocumentFromMongo = mongoHelper.getDocument;
const updateDocumentInMongo = mongoHelper.updateDocument;

const { assign, each, set, isEmpty } = require('lodash');

class ApiObject {
  constructor (options) {
    assign(this, options);
  }

  async update (options) {
    if (isEmpty(options)) {
      return;
    }

    await updateDocumentInMongo(this._docType, this, options);

    _updateLocalParameters(this, options);

    return this;
  }

  async sync () {
    let updatedDoc = await getDocumentFromMongo(this._docType, this);

    assign(this, updatedDoc);

    return this;
  }
}

class ApiHunch extends ApiObject {
  constructor (options) {
    super(options);

    this._docType = 'hunches';
  }
}

function _updateLocalParameters (doc, update) {
  each(update, (value, param) => {
    set(doc, param, value);
  });
}

module.exports = {
  ApiHunch
};
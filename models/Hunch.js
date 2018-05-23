/**
 * Created on 19-Apr-18.
 */
const slug = require('slug');
const mongoose = require('mongoose');
const omitArticles = require('../utils/omitArticles');

const SLUG_MAX_LENGTH = 100;

const generateSlug = function(next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
};

const HunchSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, maxlength: SLUG_MAX_LENGTH },
  wisdom: { type: String, required: [true, "wisdom is required"] },
  attribute: String,
}, { timestamps: true });


HunchSchema.pre('validate', generateSlug);

HunchSchema.methods.slugify = function () {
  // wisdom is always string
  if (this.wisdom === undefined)
    this.wisdom = '';
  let wisdom = this.wisdom;
  wisdom = omitArticles(wisdom);
  wisdom = wisdom.substr(0, SLUG_MAX_LENGTH);
  wisdom = wisdom.trim();
  this.slug = slug(wisdom);
};

HunchSchema.methods.toJSONFor = function () {
  return {
    id: this._id,
    slug: this.slug,
    wisdom: this.wisdom,
    attribute: this.attribute,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
};

HunchSchema.statics.SLUG_MAX_LENGTH = SLUG_MAX_LENGTH;

module.exports = mongoose.model('Hunch', HunchSchema);

module.exports.middlewares = {
  generateSlug
};

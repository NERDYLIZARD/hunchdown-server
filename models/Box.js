/**
 * Created on 29-May-18.
 */
const slug = require('slug');
const mongoose = require('mongoose');

const SLUG_MAX_LENGTH = 50;

const generateSlug = function(next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
};

const BoxSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, maxlength: SLUG_MAX_LENGTH },
  title: { type: String, required: [true, "title is required"] },
  description: String,
}, { timestamps: true });

BoxSchema.methods.toJSON = function () {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
};

BoxSchema.pre('validate', generateSlug);

BoxSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

BoxSchema.statics.SLUG_MAX_LENGTH = SLUG_MAX_LENGTH;

module.exports = mongoose.model('Box', BoxSchema);

module.exports.middlewares = {
  generateSlug
};

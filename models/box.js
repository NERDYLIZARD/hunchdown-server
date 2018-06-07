/**
 * Created on 29-May-18.
 */
const slug = require('slug');
const mongoose = require('mongoose');

const Hunch = require('./hunch');

const SLUG_MAX_LENGTH = 50;

const generateSlug = function(next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
};

const removeBoxFromHunches = async function (box, next) {
  const hunches = await Hunch.find({ _id: { $in: box.hunches } });
  const promises = [];
  for (let hunch of hunches) {
    hunch.boxes.pull(box);
    promises.push(hunch.save());
  }
  await Promise.all(promises);
  next();
};

const BoxSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, maxlength: SLUG_MAX_LENGTH },
  title: { type: String, required: [true, "title is required"] },
  description: String,
  hunches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hunch' }],
}, { timestamps: true });

BoxSchema.methods.toJSON = function () {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    description: this.description,
    hunches: this.hunches,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
};

BoxSchema.pre('validate', generateSlug);

BoxSchema.post('remove', removeBoxFromHunches);

BoxSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

BoxSchema.statics.SLUG_MAX_LENGTH = SLUG_MAX_LENGTH;

module.exports = mongoose.model('Box', BoxSchema);

module.exports.middlewares = {
  generateSlug
};

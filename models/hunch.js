/**
 * Created on 19-Apr-18.
 */
const slug = require('slug');
const urls = require('../constants/urls');
const mongoose = require('mongoose');
const omitArticles = require('../libs/omit-articles');

const SLUG_MAX_LENGTH = 100;

const generateSlug = function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
};

const removeHunchFromBoxes = async function (hunch, next) {
  const boxes = await mongoose.model('Box').find({ _id: { $in: hunch.boxes } });

  await Promise.all(boxes.map(box => {
    box.hunches.pull(hunch);
    return box.save();
  }));

  next();
};


const HunchSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, maxlength: SLUG_MAX_LENGTH },
  wisdom: { type: String, required: [true, "wisdom is required"] },
  attribute: String,
  boxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box' }],
}, { timestamps: true });


HunchSchema.pre('validate', generateSlug);

HunchSchema.post('remove', removeHunchFromBoxes);

HunchSchema.methods.slugify = function () {
  if (!this.wisdom)
    return;

  let wisdom = this.wisdom;
  wisdom = omitArticles(wisdom);
  wisdom = wisdom.substr(0, SLUG_MAX_LENGTH);
  wisdom = wisdom.trim();
  this.slug = slug(wisdom);
};

HunchSchema.methods.toJSON = function () {
  return {
    id: this._id,
    slug: this.slug,
    wisdom: this.wisdom,
    attribute: this.attribute,
    boxes: this.boxes,
    url: `${urls.HUNCHES_URL}/${this._id}`,
    boxesUrl: `${urls.HUNCHES_URL}/boxes`,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
};


module.exports = mongoose.model('Hunch', HunchSchema);

module.exports.middlewares = {
  generateSlug
};

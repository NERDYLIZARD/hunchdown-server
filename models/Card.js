/**
 * Created on 19-Apr-18.
 */
const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  wisdom: String,
  attribute: String,
}, { timestamps: true });

mongoose.model('Card', CardSchema);

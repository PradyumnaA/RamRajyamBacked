const mongoose = require('mongoose');

const galleryCategoryCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('galleryCategoryCounter', galleryCategoryCounterSchema);

module.exports = Counter;

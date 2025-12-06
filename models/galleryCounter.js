const mongoose = require('mongoose');

const galleryCounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('galleryCounter', galleryCounterSchema);

module.exports = Counter;

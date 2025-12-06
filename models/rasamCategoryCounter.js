const mongoose = require('mongoose');

const rasamCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('rasamCounter', rasamCounterSchema);

module.exports = Counter;

const mongoose = require('mongoose');

const KuldeviCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('kuldeviCounter', KuldeviCounterSchema);

module.exports = Counter;

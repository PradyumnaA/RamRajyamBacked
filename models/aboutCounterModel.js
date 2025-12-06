const mongoose = require('mongoose');

const counterAboutSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('CounterAbout', counterAboutSchema);

module.exports = Counter;

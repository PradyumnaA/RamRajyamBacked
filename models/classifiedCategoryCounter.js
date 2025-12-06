const mongoose = require('mongoose');

const classifiedCategoryCounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('classifiedCategoryCounter', classifiedCategoryCounterSchema);

module.exports = Counter;

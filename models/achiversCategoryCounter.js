const mongoose = require('mongoose');

const achiversCategoryCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('achiversCategoryCounter', achiversCategoryCounterSchema);

module.exports = Counter;

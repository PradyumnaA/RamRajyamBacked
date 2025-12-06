const mongoose = require('mongoose');

const classifiedCounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1 }
});

module.exports = mongoose.models.classifiedCounter || mongoose.model('classifiedCounter', classifiedCounterSchema);

const mongoose = require('mongoose');

const organisationsCounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1 }
});

module.exports = mongoose.models.organisationsCounter || mongoose.model('organisationsCounter', organisationsCounterSchema);

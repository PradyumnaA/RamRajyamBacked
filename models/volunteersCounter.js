const mongoose = require('mongoose');

const volunteerscounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('VolunteersCounter', volunteerscounterSchema);

module.exports = Counter;

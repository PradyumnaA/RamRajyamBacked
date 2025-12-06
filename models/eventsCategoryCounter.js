const mongoose = require('mongoose');

const EventsCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('eventsCounter', EventsCounterSchema);

module.exports = Counter;

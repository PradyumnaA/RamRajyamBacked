const mongoose = require('mongoose');

const jobCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const JobCounter = mongoose.model('JobCounter', jobCounterSchema);

module.exports = JobCounter;

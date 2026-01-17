const mongoose = require('mongoose');

const bookLikesCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BookLikesCounter', bookLikesCounterSchema);

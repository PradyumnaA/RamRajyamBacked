const mongoose = require('mongoose');

const eventsLikeSchema = new mongoose.Schema({
  eventId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('EventsLike', eventsLikeSchema);

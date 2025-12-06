const mongoose = require('mongoose');

const likeNewsSchema = new mongoose.Schema({
  newsId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('LikeNews', likeNewsSchema);

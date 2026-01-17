const mongoose = require('mongoose');

const bookLikesSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'BooksLibrary', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isLiked: { type: Boolean, default: true }, // true = liked, false = disliked
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Ensure one like/dislike per user per book
bookLikesSchema.index({ bookId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('BookLikes', bookLikesSchema);

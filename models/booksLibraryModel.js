const mongoose = require('mongoose');

const booksLibrarySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['Like New', 'Good', 'Fair'], required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  sellerName: { type: String, required: true },
  sellerContact: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Available', 'Sold', 'Unavailable'], default: 'Available' },
  views: { type: Number, default: 0 },
  interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('BooksLibrary', booksLibrarySchema);

const mongoose = require('mongoose');

const achiversSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: Number, ref: 'Category', required: true }, // Referencing by `id` instead of `_id`
  description: { type: String, required: true },
  date: { type: Date, required: true },
  city: { type: String, required: true },
//   status: { type: String, enum: ['pending','yes', 'no'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('achivers', achiversSchema);

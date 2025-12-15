const mongoose = require('mongoose');

const achiversSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'AchiversCategory', required: true }, // Referencing by `_id` instead of `id`
  description: { type: String, required: true },
  date: { type: Date, required: true },
  city: { type: String, required: true },
//   status: { type: String, enum: ['pending','yes', 'no'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('achivers', achiversSchema);

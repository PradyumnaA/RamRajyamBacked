const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Updated enum values
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isApproved: { type: Boolean, default: false }, // Added field for approval status
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
  
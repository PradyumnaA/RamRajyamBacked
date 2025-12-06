const mongoose = require('mongoose');

const classifiedSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  category: { type: Number, ref: 'Category', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Updated enum values
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isApproved: { type: Boolean, default: false }, 
}, { timestamps: true });

module.exports = mongoose.models.Classified || mongoose.model('Classified', classifiedSchema);

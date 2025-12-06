const mongoose = require('mongoose');

const businessNetworkSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: Number, ref: 'Category', required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.BusinessNetwork || mongoose.model('BusinessNetwork', businessNetworkSchema);

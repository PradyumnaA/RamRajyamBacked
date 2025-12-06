const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'JobCategory', required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // New field
});

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;

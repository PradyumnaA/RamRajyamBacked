const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },


}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);

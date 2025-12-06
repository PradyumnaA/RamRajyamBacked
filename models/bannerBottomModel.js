const mongoose = require('mongoose');

const bannerBottomSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('bannerBottom', bannerBottomSchema);

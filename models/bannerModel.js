const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
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
  },
  url: {
    type: String, // This field will store the URL
    required: true, // If URL is mandatory, keep it as `required: true`, otherwise set it to `false`
  },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);

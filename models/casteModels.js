const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasteSubcasteGotraSchema = new Schema({
  caste: {
    type: String,
    required: true,
  },
  subcaste: {
    type: String,
    required: false, // Make subcaste optional
  },
  gotra: {
    type: String,
    required: false, // Make gotra optional
  },
}, { timestamps: true });

module.exports = mongoose.model('CasteSubcasteGotra', CasteSubcasteGotraSchema);

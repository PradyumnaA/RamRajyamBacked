// models/vratModel.js
const mongoose = require('mongoose');

const varatSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: Number, ref: 'subCategory' },
  subcategory: { type: Number, ref: 'subSubCategory' }, // Add subcategory field
  description: { type: String },
}, { timestamps: true });

const Varat = mongoose.model('Varat', varatSchema);

module.exports = Varat;

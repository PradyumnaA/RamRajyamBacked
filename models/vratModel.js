// models/vratModel.js
const mongoose = require('mongoose');

const varatSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'varatSubCategory' },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'varatSubSubCategory' }, // Add subcategory field
  description: { type: String },
}, { timestamps: true });

const Varat = mongoose.model('Varat', varatSchema);

module.exports = Varat;

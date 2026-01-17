const mongoose = require('mongoose');

const rasamSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'rasamCategory', required: true }, // Reference to Category
}, { timestamps: true });

const Rasam = mongoose.model('Rasam', rasamSchema);

module.exports = Rasam;

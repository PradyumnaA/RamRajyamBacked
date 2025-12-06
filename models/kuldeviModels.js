const mongoose = require('mongoose');

const kuldeviSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'kuldeviCategory', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Kuldevi = mongoose.model('Kuldevi', kuldeviSchema);

module.exports = Kuldevi;

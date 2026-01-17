const mongoose = require('mongoose');

const classifiedCategorySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true } // Changed to String
});

module.exports = mongoose.model('classifiedCategory', classifiedCategorySchema);

const mongoose = require('mongoose');

const kuldeviCategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const Category = mongoose.model('kuldeviCategory', kuldeviCategorySchema);

module.exports = Category;

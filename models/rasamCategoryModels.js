const mongoose = require('mongoose');

const rasamCategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const Category = mongoose.model('rasamCategory', rasamCategorySchema);

module.exports = Category;

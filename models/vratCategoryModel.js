const mongoose = require('mongoose');

const varatCategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
  name: { type: String, required: true , unique: true},
  image: { type: String, required: true }
});

const Category = mongoose.model('varatCategory', varatCategorySchema);

module.exports = Category;

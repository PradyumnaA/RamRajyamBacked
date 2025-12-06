const mongoose = require('mongoose');

const varatSubCategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true ,unique: true},
  image: { type: String, required: true },
  category: { type: Number, ref: 'Category', },
});

const subCategory = mongoose.model('varatSubCategory', varatSubCategorySchema);

module.exports = subCategory;

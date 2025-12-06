const mongoose = require('mongoose');

const varatSubSubCategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true ,unique: true},
  image: { type: String, required: true },
  category: { type: Number, ref: 'Category', },
});


const SubSubCategory = mongoose.model('varatSubSubCategory', varatSubSubCategorySchema);

module.exports = SubSubCategory;

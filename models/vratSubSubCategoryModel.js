const mongoose = require('mongoose');

const varatSubSubCategorySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true ,unique: true},
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'vratSubCategory' },
});


const SubSubCategory = mongoose.model('varatSubSubCategory', varatSubSubCategorySchema);

module.exports = SubSubCategory;

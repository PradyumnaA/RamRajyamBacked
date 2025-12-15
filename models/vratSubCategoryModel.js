const mongoose = require('mongoose');

const varatSubCategorySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true ,unique: true},
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'vratCategory' },
});
});

const subCategory = mongoose.model('varatSubCategory', varatSubCategorySchema);

module.exports = subCategory;

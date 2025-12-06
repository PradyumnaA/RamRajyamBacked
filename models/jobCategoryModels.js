const mongoose = require('mongoose');

const JobCategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const Category = mongoose.model('JobCategory', JobCategorySchema);

module.exports = Category;

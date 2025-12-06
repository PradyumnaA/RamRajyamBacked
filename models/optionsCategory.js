const mongoose = require('mongoose');

const userOptionsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true,unique:true },
  image: { type: String, required: true }
});

const Category = mongoose.model('userOptionsCategory', userOptionsCategorySchema);

module.exports = Category;

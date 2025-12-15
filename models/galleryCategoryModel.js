const mongoose = require('mongoose');

const galleryCategorySchema = new mongoose.Schema({
    id: { type: String, unique: true },
  name: { type: String, required: true },
 
});

const Category = mongoose.model('galleryCategory', galleryCategorySchema);

module.exports = Category;

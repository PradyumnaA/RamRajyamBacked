const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    id: { type: String, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  category: { type: String, required: true } 
});

const Category = mongoose.model('about', aboutSchema);

module.exports = Category;

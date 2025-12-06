const mongoose = require('mongoose');

const categoryArchiversSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const Category = mongoose.model('archiversCategory', categoryArchiversSchema);

module.exports = Category;

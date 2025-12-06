const mongoose = require('mongoose');

const eventsCategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const Category = mongoose.model('eventsCategory', eventsCategorySchema);

module.exports = Category;

const mongoose = require('mongoose');

const eventsCategorySchema = new mongoose.Schema({
    id: { type: String, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true }
});

const Category = mongoose.model('eventsCategory', eventsCategorySchema);

module.exports = Category;

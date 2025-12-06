const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);

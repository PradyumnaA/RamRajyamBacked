const mongoose = require('mongoose');

const selectedOptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'userOptionsCategory', required: true },
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const SelectedOption = mongoose.model('SelectedOption', selectedOptionSchema);

module.exports = SelectedOption;

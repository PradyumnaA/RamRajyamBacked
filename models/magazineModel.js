const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdf: { type: String, required: true }, // S3 key for the PDF
  image: { type: String, required: true }, // S3 key for the image
}, { timestamps: true });

module.exports = mongoose.model('Magazine', magazineSchema);

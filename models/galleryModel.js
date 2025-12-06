const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: Number, ref: 'Category', required: true }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;

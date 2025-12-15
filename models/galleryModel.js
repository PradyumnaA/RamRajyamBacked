const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryCategory', required: true }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    link: { type: String }
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;

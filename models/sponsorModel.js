const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    image: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    title: { type: String, required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    url: { type: String, required: true }, // New field added here
}, { timestamps: true });

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;

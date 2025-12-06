const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    regId: {
        type: Number,
        unique: true,
        
    },
    fullName: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Optional: Define acceptable values
        required: false
    },
    bloodYN: String,
    pincode: String,
    address: String,
    state: String,
    city: String,
    subcaste: String,
    bloodGroup: String,
    nativeOf: String,
    homeDistrict: String,
    homeCity: String,
    caste: String,
    gotra: String,
    kuldeviName: String,
    selectedJobCategories: [String], // Changed to array of strings to hold multiple categories
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        unique: true,
        required: true
        
    },
    businessProfile: {
        firmName: String,
        firmAddress: String,
        dealsWith: String,
    
        website: String,
        businessImages: [String] // Field for multiple images
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true // Allow null or undefined values
    },
    referralCount: {
        type: Number,
        default: 0
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matrimony' }],
    selectedPackage: { type: Schema.Types.ObjectId, ref: 'packageMatrimony' },
    selectedOptions: [{
        type: Schema.Types.ObjectId,
        ref: 'SelectedOptions'
    }],
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

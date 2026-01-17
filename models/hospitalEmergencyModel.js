const mongoose = require('mongoose');

const hospitalEmergencySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  city: { type: String, required: true },
  hospital: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  qualifications: [{ type: String }],
  experience: { type: Number },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  availability: { type: String, default: 'Available Now' },
  image: { type: String },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  verifiedByAdmin: { type: Boolean, default: false },
  latitude: { type: Number },
  longitude: { type: Number },
  distance: { type: String },
  isKurmiSamajMember: { type: Boolean, default: true },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('HospitalEmergency', hospitalEmergencySchema);

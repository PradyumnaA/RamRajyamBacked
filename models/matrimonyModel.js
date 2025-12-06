const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matrimonySchema = new Schema({
  userName: { type: String, required: true },
  images: [{ type: String, required: true }], 
  fullName: { type: String, required: true },
  fathersName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
  fatherMobile: { type: String },
  numOfBrothers: { type: Number },
  numOfSisters: { type: Number },
  manglik: { type: Boolean },
  bodyColor: { type: String },
  height: { type: Number },
  bloodGroup: { type: String },
  dateOfBirth: { type: Date },
  birthTime: { type: String },
  address: { type: String },
  mobileNo: { type: String, required: true },
  education: { type: String },
  subcaste: { type: String },
  profession: { type: String },

  perAnnum: { type: String },
  gotra: { type: String },
  image: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  about: { type: String, required: true },
  packageName: { type: Schema.Types.ObjectId, ref: 'packageMatrimony' },
  selectedPackage: { type: Schema.Types.ObjectId, ref: 'packageMatrimony' },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  
}, { timestamps: true });

const Matrimony = mongoose.model('Matrimony', matrimonySchema); // Registering the model correctly

module.exports = Matrimony;

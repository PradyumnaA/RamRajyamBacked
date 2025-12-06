const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  pincode: { type: String, required: true },
  
}, { timestamps: true });

const Bank = mongoose.model('bloodBank', bloodBankSchema);

module.exports = Bank;

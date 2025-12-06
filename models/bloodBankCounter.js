const mongoose = require('mongoose');

const bloodBankbloodBankbloodBank = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('bloodBankCounter', bloodBankbloodBankbloodBank);

module.exports = Counter;

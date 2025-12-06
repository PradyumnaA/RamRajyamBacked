const mongoose = require('mongoose');

const businessNetworkCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.models.businessNetworkCounter || mongoose.model('businessNetworkCounter', businessNetworkCounterSchema);

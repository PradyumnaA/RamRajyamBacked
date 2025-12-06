const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestMatrimonySchema = new Schema({
  matrimonyUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matrimony', // Reference the correct model name
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Request = mongoose.model('requestMatrimony', requestMatrimonySchema);

module.exports = Request;

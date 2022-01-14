const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  uid: { type: Number, required: true },
  vendor: String,
  status: { type: String, enum: ['online', 'offline'], required: true },
  created: { type: Date, default: new Date() },
}, { _id: false });

module.exports = DeviceSchema
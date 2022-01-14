const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  uid: {
    type: Number,
    required: [true, 'UID is required.']
  },
  vendor: String,
  status: {
    type: String,
    enum: {
      values: ['online', 'offline'],
      message: '{VALUE} is not supported'
    },
    required: [true, 'Status is required']
  },
  created: { type: Date, default: new Date() },
}, { _id: false });

module.exports = DeviceSchema
const mongoose = require('mongoose');
const DeviceSchema = require('./device');

const GatewaySchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, index: { unique: true} },
  name: { type: String, required: true },
  IPv4: { type: String, required: true},
  devices: [DeviceSchema]
}, { _id: true, versionKey: false });

module.exports = mongoose.model('Gateway', GatewaySchema);
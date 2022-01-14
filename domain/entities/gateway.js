const mongoose = require('mongoose');
const DeviceSchema = require('./device');

const GatewaySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: [true, 'Serial Number is required.'],
    index: { unique: true}
  },
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  IPv4: {
    type: String,
    validate: {
      validator: function (v) {
        const segments = (v || '').split('.')
        return segments.length === 4 && segments.every((segment) => segment >= 0 && segment <= 255);
      },
      message: props => `${props.value} is not a valid IPv4 address.`
    },
    required: [true, 'IPv4 is required.']
  },
  devices: [DeviceSchema]
}, { _id: true, versionKey: false });

module.exports = mongoose.model('Gateway', GatewaySchema);
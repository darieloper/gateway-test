const BaseRepository = require('./base.repository');
const Gateway = require('../entities/gateway');
const mongoose = require('mongoose');

class GatewayRepository  extends BaseRepository {
  constructor() {
    super(Gateway);
  }

  async addDevice(gatewayId, device) {
    if (!mongoose.Types.ObjectId.isValid(gatewayId)) {
      return null;
    }

    const gateway = await this.model.findOne({ _id: gatewayId });
    gateway.devices.push(device);
    return await gateway.save();
  }

  async removeDevice(gatewayId, deviceUID) {
    if (!mongoose.Types.ObjectId.isValid(gatewayId)) {
      return null;
    }

    return await this.model.findOneAndUpdate(
      { _id: gatewayId, 'devices.uid': deviceUID },
      { $pull: { devices: { uid: deviceUID } } },
      { new: true }
    );
  }

  async store(gateway) {
    return await this.model(gateway).save();
  }
}

module.exports = GatewayRepository;
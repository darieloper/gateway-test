const BaseRepository = require('./base.repository');
const Gateway = require('../entities/gateway');

class GatewayRepository  extends BaseRepository {
  constructor() {
    super(Gateway);
  }

  async addDevice(gatewayId, device) {
    const gateway = await this.model.findOne({ _id: gatewayId });
    gateway.devices.push(device);
    return await gateway.save();
  }
}

module.exports = GatewayRepository;
const BaseRepository = require('./base.repository');
const Gateway = require('../entities/gateway');

class GatewayRepository  extends BaseRepository {
  constructor() {
    super(Gateway);
  }
}

module.exports = GatewayRepository;
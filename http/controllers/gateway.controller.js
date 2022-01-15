const BaseController = require('./base.controller');
const GatewayRepository = require('../../domain/repositories/gateway.repository');

module.exports = class GatewayController extends BaseController {
  path = '/gateways';

  constructor() {
    super();
    this.gatewayRepository = new GatewayRepository();
  }

  initializeRoutes() {
    this.router.get('/', this.all.bind(this));
    this.router.get('/:id', this.show.bind(this));
    this.router.put('/:id/add-device', this.addDevice.bind(this));
  }

  async all(req, resp) {
    try {
      const data = await this.gatewayRepository.getAll();
      return resp.status(200).send({ ok: true, data });
    } catch (error) {
      resp.status(500).send({ ok: false, error });
    }
  }

  async show(req, resp) {
    try {
      const gateway = await this.gatewayRepository.findById(req.params.id)
      return resp.status(200).send({ ok: true, data: gateway });
    } catch (error) {
      resp.status(500).send({ ok: false, error });
    }
  }

  async addDevice(req, resp) {
    try {
      const gateway = await this.gatewayRepository.addDevice(req.params.id, req.body);

      return resp.status(200).send({ ok: true, data: gateway });
    } catch (error) {
      resp.status(500).send({ ok: false, error });
    }
  }
}
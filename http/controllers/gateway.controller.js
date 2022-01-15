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
    this.router.post('/', this.create.bind(this));
    this.router.post('/:id/add-device', this.addDevice.bind(this));
    this.router.delete('/:id/remove-device/:deviceId', this.removeDevice.bind(this));
  }

  async all(req, resp) {
    try {
      const data = await this.gatewayRepository.getAll();
      return resp.status(200).send({ ok: true, data });
    } catch (error) {
      resp.status(500).send({ ok: false, data: null, error });
    }
  }

  async show(req, resp) {
    try {
      const gateway = await this.gatewayRepository.findById(req.params.id)

      if (gateway === null) {
        resp.status(500).send({ ok: false, data: null, error: { message: 'Gateway not found.' } });
        return;
      }

      return resp.status(200).send({ ok: true, data: gateway });
    } catch (error) {
      resp.status(500).send({ ok: false, data: null,  error });
    }
  }

  async create(req, resp) {
    try {
      const gateway = await this.gatewayRepository.store(req.body);

      resp.status(200).send({ ok: true, data: gateway });
    } catch (error) {
      const errorData = error.code === 11000
        ? { message: `Exist already a Gateway with the same Serial Number: ${req.body.serialNumber}`}
        : error;
      resp.status(500).send({ ok: false, data: null,  error: errorData });
    }
  }

  async addDevice(req, resp) {
    try {
      const gateway = await this.gatewayRepository.addDevice(req.params.id, req.body);

      if (gateway === null) {
        resp.status(500).send({ ok: false, data: null, error: { message: 'Gateway not found.' } });
        return;
      }

      return resp.status(200).send({ ok: true, data: gateway });
    } catch (error) {
      resp.status(500).send({ ok: false, data: null, error });
    }
  }

  async removeDevice(req, resp) {
    try {
      const gateway = await this.gatewayRepository.removeDevice(req.params.id, req.params.deviceId);

      if (gateway === null) {
        resp.status(500).send({
          ok: false,
          data: null,
          error: { message: 'Gateway not found with that specific Device UID.' }
        });
        return;
      }

      return resp.status(200).send({ ok: true, data: gateway });
    } catch (error) {
      resp.status(500).send({ ok: false, data: null, error });
    }
  }
}
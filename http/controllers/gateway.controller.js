const BaseController = require('./base.controller');

module.exports = class GatewayController extends BaseController{
  path = '/gateways';

  constructor() {
    super();
  }

  initializeRoutes() {
    this.router.get('/', this.all.bind(this));
    this.router.get('/:id', this.show.bind(this));
  }

  all(req, resp) {
    return resp.status(200).send({ok: true, data: []});
  }

  show(req, resp) {
    return resp.status(200).send({ok: true, data: null});
  }
}
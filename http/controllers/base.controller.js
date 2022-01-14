const { Router } = require('express')

module.exports = class BaseController {
  path = '';

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    throw new Error('You must to implement this method [initializeRoutes]');
  }
}
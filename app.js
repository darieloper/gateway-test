const express = require('express');
const mongoose = require('mongoose');
const logger = require('./http/middlewares/logger.middleware');

const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017';

module.exports = class App {
  basePath = '/api';

  constructor(port, controllers) {
    this.port = port;
    this.app = express();
    this.controllers = controllers || [];

    this.initializeMiddlewares();
    this.initializeControllers();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(logger);
  }

  initializeControllers() {
    this.controllers.forEach((controller) => this.app.use(this.basePath + controller.path, controller.router))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Start App listening in Port: ${this.port}`);
    })
  }

  run() {
    const runApp = async () => {
      await mongoose.connect(MONGODB_CONNECTION);
      this.listen();
    }

    runApp().catch((error) => console.log('Error', error));
  }

  get appInstance() {
    return this.app
  }
}
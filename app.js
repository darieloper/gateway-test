const express = require('express');
const mongoose = require('mongoose');
const logger = require('./http/middlewares/logger.middleware');
const AppConfig = require('./config/app')
const cors = require('cors')
const path = require('path')

module.exports = class App {
  basePath = '/api';

  constructor(port, controllers) {
    this.port = port;
    this.app = express();
    this.controllers = controllers || [];
    console.log('----------------------constructor-----------------');

    this.initializeMiddlewares();
    this.initializeControllers();
    console.log('-----------------before---------------------------');
    this.initializeStaticResources();
    console.log('-----------------after-----------------------------');
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());

    if (process.env.NODE_ENV !== 'test') {
      this.app.use(logger);
    }
  }

  initializeStaticResources() {
    console.log(process.env.NODE_ENV);
    /*if (!'production'.includes(process.env.NODE_ENV)) {
      return
    }*/

    console.log('starting serving static files');
    this.app.use(express.static(path.join(__dirname, 'front', 'build')));

    console.log('starting redirecting for react router');
    this.app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, 'front', 'build', 'index.html'));
    });

    console.log('end static resources initialation');
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
      await mongoose.connect(AppConfig.MONGODB_CONNECTION);
      this.listen();
    }

    runApp().catch((error) => console.log('Error', error));
  }

  get expressInstance() {
    return this.app
  }
}

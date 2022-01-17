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
    
    this.app.use(express.static(path.join(__dirname, 'front', 'build')));
    this.app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, 'front', 'build', 'index.html'));
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Start App listening in Port: ${this.port}`);
    })
  }

  run() {
    const runApp = async () => {
      this.listen();
    }

    runApp().catch((error) => console.log('Error', error));
  }

  get expressInstance() {
    return this.app
  }
}

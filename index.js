const App = require('./app');
const GatewayController = require('./http/controllers/gateway.controller');

const port = process.env.BACKEND_PORT || 3001;

const app = new App(port, [
  new GatewayController()
]);

if (process.env.NODE_ENV === 'test') {
  module.exports = app.expressInstance
} else {
  app.run();
}

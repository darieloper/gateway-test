const App = require('./app');
const GatewayController = require('./http/controllers/gateway.controller');

const port = process.env.BACKEND_PORT || 6000;

const app = new App(port, [
  new GatewayController()
]);

app.run();
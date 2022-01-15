const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/nodejs-test-project';
const MAX_DEVICES_PER_GATEWAY = process.env.MAX_DEVICES_PER_GATEWAY || 10;

module.exports = {
  MONGODB_CONNECTION,
  MAX_DEVICES_PER_GATEWAY
}
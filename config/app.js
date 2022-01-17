const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/nodejs-test-project';
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || 'gateways';
const MAX_DEVICES_PER_GATEWAY = process.env.MAX_DEVICES_PER_GATEWAY || 10;

module.exports = {
  MONGODB_CONNECTION,
  MONGODB_COLLECTION,
  MAX_DEVICES_PER_GATEWAY
}
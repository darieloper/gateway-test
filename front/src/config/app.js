const maxDevices = process.env.MAX_DEVICES_PER_GATEWAY || 10
const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001/api/gateways/'

export {
  maxDevices,
  baseUrl
}
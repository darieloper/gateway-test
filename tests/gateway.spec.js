const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const BASE_URL = '/api/gateways';
const AppConfig = require('../config/app');
let server;

describe('Testing Gateways endpoints', () => {
  beforeAll((done) => {
    mongoose.connect(AppConfig.MONGODB_CONNECTION).then(() => {
      server = request(app);
      done();
    });
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });

  it('Get all Gateways', async () => {
    const res = await server.get(BASE_URL);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
    expect(Array.isArray(res.body.data)).toBeTruthy();
  })
})
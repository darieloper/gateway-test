const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const BASE_URL = '/api/gateways';
const AppConfig = require('../config/app');
const faker = require('@faker-js/faker');
let server;

const getRandomGateway = async () => {
  const res = await server.get(BASE_URL);
  const randomPos = faker.datatype.number({ min: 0, max: res.body.data.length - 1});
  const gateway = res.body.data[randomPos];
  expect(!!gateway).toBeTruthy();
  expect(!!gateway._id).toBeTruthy();

  return gateway;
}

const wasBadResponse = (res) => {
  expect(res.statusCode).toBe(500);
  expect(res.body.ok).toBeFalsy();
  expect(res.body.data).toBe(null);
}

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
  });

  it('Get specific Gateway', async () => {
    const gateway = await getRandomGateway();
    const showResponse = await server.get(BASE_URL + '/' + gateway._id);
    expect(showResponse.statusCode).toBe(200);
    expect(showResponse.body.ok).toBeTruthy();
    expect(showResponse.body.data).toStrictEqual(gateway);

    const badResponse = await server.get(BASE_URL + '/123');
    wasBadResponse(badResponse);
  });

  it('Add new Device to a Gateway', async () => {
    const gateway = await getRandomGateway();
    const badResponse = await server.post(BASE_URL + '/456/add-device');
    wasBadResponse(badResponse);

    const badValidationResponse = await server.post(BASE_URL + '/' + gateway._id + '/add-device');
    expect(badValidationResponse.statusCode).toBe(500);
    expect(badValidationResponse.body.ok).toBeFalsy();
    expect(badValidationResponse.body.data).toBe(null);
    expect(Object.keys(badValidationResponse.body.error.errors).length).toBe(2); // 2 Required Fields: UID and Status
    expect(badValidationResponse.body.error.message).toContain('Gateway validation failed');
    expect(badValidationResponse.body.error.message).toContain('UID is required');
    expect(badValidationResponse.body.error.message).toContain('Status is required');

    const badStatuses = ['onlines', 'OFFline'];
    const statusValue = faker.helpers.randomize(badStatuses);
    const badValidationStatusResponse = await server.post(BASE_URL + '/' + gateway._id + '/add-device')
      .send({
        uid: faker.datatype.number(),
        vendor: faker.company.companyName(),
        status: statusValue
      });
    expect(badValidationStatusResponse.statusCode).toBe(500);
    expect(badValidationStatusResponse.body.ok).toBeFalsy();
    expect(badValidationStatusResponse.body.data).toBe(null);
    expect(Object.keys(badValidationStatusResponse.body.error.errors).length).toBe(1); // 2 Required Fields: UID and Status
    expect(badValidationStatusResponse.body.error.message).toContain('Gateway validation failed');
    expect(badValidationStatusResponse.body.error.message).toContain(`${statusValue} is not supported`);

    const statuses = ['online', 'offline'];
    const res = await server.post(BASE_URL + '/' + gateway._id + '/add-device')
      .send({
        uid: faker.datatype.number(),
        vendor: faker.company.companyName(),
        status: faker.helpers.randomize(statuses)
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.data.devices.length).toBe(gateway.devices.length + 1);

    for (let i = AppConfig.MAX_DEVICES_PER_GATEWAY; i > gateway.devices.length + 1; i--) {
      await server.post(BASE_URL + '/' + gateway._id + '/add-device')
        .send({
          uid: faker.datatype.number(),
          vendor: faker.company.companyName(),
          status: faker.helpers.randomize(statuses)
        });
    }

    const lastResponse = await server.post(BASE_URL + '/' + gateway._id + '/add-device')
      .send({
        uid: faker.datatype.number(),
        vendor: faker.company.companyName(),
        status: faker.helpers.randomize(statuses)
      });

      expect(lastResponse.statusCode).toBe(500);
      expect(lastResponse.body.ok).toBeFalsy();
      expect(lastResponse.body.data).toBe(null);
      expect(lastResponse.body.error.errors.devices.message)
        .toBe(`The max devices per gateway is ${AppConfig.MAX_DEVICES_PER_GATEWAY}.`)
  });
})
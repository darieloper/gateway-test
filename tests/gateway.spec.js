const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const BASE_URL = '/api/gateways';
const AppConfig = require('../config/app');
const faker = require('@faker-js/faker');
let server;

// Get one Gateway randomly from `/` endpoint (All gateways)
const getRandomGateway = async () => {
  const res = await server.get(BASE_URL);
  const randomPos = faker.datatype.number({ min: 0, max: res.body.data.length - 1});
  const gateway = res.body.data[randomPos];
  expect(!!gateway).toBeTruthy();
  expect(!!gateway._id).toBeTruthy();

  return gateway;
}

// Check that the response is wrong
const wasBadResponse = (res) => {
  expect(res.statusCode).toBe(500);
  expect(res.body.ok).toBeFalsy();
  expect(res.body.data).toBe(null);
}

// Verify that data returned by Show endpoint is equal to data param
const expectBeEqualFromShowEndPoint = async (id, data) => {
  const showResponse = await server.get(BASE_URL + '/' + id);
  expect(showResponse.statusCode).toBe(200);
  expect(showResponse.body.ok).toBeTruthy();
  expect(showResponse.body.data).toStrictEqual(data);
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
    await expectBeEqualFromShowEndPoint(gateway._id, gateway);

    const badResponse = await server.get(BASE_URL + '/123');
    wasBadResponse(badResponse);
  });

  it('Add new Gateway', async () => {
    const gateway = await getRandomGateway();

    const badValidationResponse = await server.post(BASE_URL);
    expect(badValidationResponse.statusCode).toBe(500);
    expect(badValidationResponse.body.ok).toBeFalsy();
    expect(badValidationResponse.body.data).toBe(null);
    expect(Object.keys(badValidationResponse.body.error.errors).length).toBe(3); // 3 Required Fields: SerialNumber, Name and IPv4
    expect(badValidationResponse.body.error.message).toContain('Gateway validation failed');
    expect(badValidationResponse.body.error.message).toContain('Serial Number is required');
    expect(badValidationResponse.body.error.message).toContain('Name is required');
    expect(badValidationResponse.body.error.message).toContain('IPv4 is required');

    const badValidationIPv4Response = await server.post(BASE_URL)
      .send({
        serialNumber: faker.datatype.uuid(),
        name: faker.lorem.slug(),
        IPv4: '0.0.0.256',
      });
    expect(badValidationIPv4Response.statusCode).toBe(500);
    expect(badValidationIPv4Response.body.ok).toBeFalsy();
    expect(badValidationIPv4Response.body.data).toBe(null);
    expect(Object.keys(badValidationIPv4Response.body.error.errors).length).toBe(1); // 1 Validation Error
    expect(badValidationIPv4Response.body.error.message).toContain('Gateway validation failed');
    expect(badValidationIPv4Response.body.error.message).toContain(`0.0.0.256 is not a valid IPv4 address`);

    const badValidationSNUniqueResponse = await server.post(BASE_URL)
      .send({
        serialNumber: gateway.serialNumber,
        name: faker.lorem.slug(),
        IPv4: '0.0.0.0',
      });
    expect(badValidationSNUniqueResponse.statusCode).toBe(500);
    expect(badValidationSNUniqueResponse.body.ok).toBeFalsy();
    expect(badValidationSNUniqueResponse.body.data).toBe(null);
    expect(badValidationSNUniqueResponse.body.error.message).toContain(`Exist already a Gateway with the same Serial Number`);

    let newGateway = {
      serialNumber: faker.datatype.uuid(),
      name: faker.lorem.slug(),
      IPv4: faker.internet.ip(),
    };
    let res = await server.post(BASE_URL).send(newGateway);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
    const { devices, _id, ...responseGateway } = res.body.data;
    expect(responseGateway).toStrictEqual(newGateway);

    expectBeEqualFromShowEndPoint(res.body.data._id, res.body.data);

    newGateway = {
      serialNumber: faker.datatype.uuid(),
      name: faker.lorem.slug(),
      IPv4: faker.internet.ip(),
      devices: [
        {
          uid: faker.datatype.number(),
          vendor: faker.company.companyName(),
          status: 'online'
        },
        {
          uid: faker.datatype.number(),
          vendor: faker.company.companyName(),
          status: 'offline'
        }
      ]
    };

    res = await server.post(BASE_URL).send(newGateway);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
    const resData = Object.assign({}, res.body.data)

    // Remove unnecessary data to compare with Gateway original data
    delete resData['_id'];
    resData.devices = resData.devices.map((device) => {
      const { created, ...deviceData } = device;
      return deviceData;
    })
    expect(resData).toStrictEqual(newGateway);
    expectBeEqualFromShowEndPoint(res.body.data._id, res.body.data);

    // Check validation at device levels in creation process
    newGateway.devices[0].status = 'OFFLINE'; // Invalid status value
    res = await server.post(BASE_URL).send(newGateway);
    expect(res.statusCode).toBe(500);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.error.message).toContain('Gateway validation failed');
    expect(res.body.error.message).toContain('OFFLINE is not supported');
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
    expect(Object.keys(badValidationStatusResponse.body.error.errors).length).toBe(1); // 1 Validation Error
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

  it('Remove Device from a Gateway', async () => {
    const gateway = await getRandomGateway();
    const badResponse = await server.delete(BASE_URL + '/456/remove-device/789');
    wasBadResponse(badResponse);

    const badDeviceIdResponse = await server.delete(BASE_URL + '/' + gateway._id + '/remove-device/789');
    wasBadResponse(badDeviceIdResponse);

    const res = await server.delete(BASE_URL + '/' + gateway._id + '/remove-device/' + gateway.devices[0].uid);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.data.devices.length).toBe(gateway.devices.length - 1);
  });
})
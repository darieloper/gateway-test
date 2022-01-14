const mongoose = require('mongoose');
const Gateway = require('../domain/entities/gateway');
const faker = require('@faker-js/faker');
const AppConfig = require('../config/app');

let linkedDevices = 0;
const maxGateways = faker.datatype.number({ min: 5, max: 20 });

const runSeeder = async () => {
  let devices, maxDevices;
  let statuses = ['online', 'offline'];
  const oneMonthInTime = 1000*60*60*24*30;

  await mongoose.connect(AppConfig.MONGODB_CONNECTION);

  await Gateway.deleteMany({}).exec();

  for (let i = 0; i < maxGateways; i++) {
    devices = [];
    maxDevices = faker.datatype.number({ min: 1, max: 10 });

    for (let j = 0; j < maxDevices; j++) {
      let created = new Date();
      created.setTime(created.getTime() - faker.datatype.number({ min: 0, max: oneMonthInTime }))

      devices.push({
        uid: faker.datatype.number(),
        vendor: faker.company.companyName(),
        status: statuses[faker.datatype.number({ min: 0, max: 1})],
        created: created
      });
    }

    linkedDevices += maxDevices;

    let model = new Gateway({
      serialNumber: faker.datatype.uuid(),
      name: faker.lorem.slug(),
      IPv4: faker.internet.ip(),
      devices
    });

    await model.save();
  }

  await mongoose.disconnect();
}

runSeeder().then(() => {
  console.log('✨ Seeding process completed successfully!');
  console.log(`   ${maxGateways} Gateways and ${linkedDevices} devices.`);
  console.log();
}).catch((error) => console.log('Some errors occurred trying to populate database.', error));


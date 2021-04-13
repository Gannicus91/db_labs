const faker = require('faker');
const { ObjectId } = require('mongodb');
const { arrayOfRandomCountObjects } = require('./generators');

const address = () => ({
  name: faker.random.word(),
  street: faker.address.streetAddress(false),
  city: faker.address.city(),
  state: faker.address.state(),
  zip: faker.address.zipCode(),
});

const payment_method = () => ({
  name: faker.finance.accountName(),
  last_four: faker.finance.mask(),
  crypted_name: faker.datatype.uuid(),
  expiration_date: faker.date.future(),
});

const user = () => ({
  _id: new ObjectId(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  hashed_password: faker.internet.password(),
  addresses: arrayOfRandomCountObjects(3, address),
  payment_methods: arrayOfRandomCountObjects(2, payment_method),
});

module.exports = user;

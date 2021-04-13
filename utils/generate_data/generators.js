const faker = require('faker');


const arrayOfRandomCountObjects = (n, cb) => faker.datatype.array(faker.datatype.number(n)+1).map(() => cb());
const arrayOfObjects = (n, cb, args = []) => {
  if (n === 0) return [];
  return [
    cb.apply(null, args),
    ...arrayOfObjects(n - 1, cb, args),
  ];
};

module.exports = {
  arrayOfRandomCountObjects,
  arrayOfObjects,
};

const user = require('./users');
const category = require('./categories');
const product = require('./products');
const review = require('./reviews');
const order = require('./orders');
const generators = require('./generators');

module.exports = {
  ...generators,
  user,
  category,
  product,
  review,
  order,
};

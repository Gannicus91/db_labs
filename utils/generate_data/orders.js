const faker = require('faker');
const { ObjectId } = require('mongodb');

const ORDER_STATES = [
  'CART',
  'PAID',
  'PREPARING_FOR_SHIPMENT',
  'IN_DELIVERING',
];

const order = (users, products) => {
  if (!users || !products) return;

  const orderingProducts = faker.random.arrayElements(products, faker.datatype.number({ min: 1, max: 4 }));
  const user = faker.random.arrayElement(users);

  return {
    _id: new ObjectId(),
    user_id: user._id,
    state: faker.random.arrayElement(ORDER_STATES),
    lines_items: [
      ...orderingProducts.map(({ _id, sku, name, pricing }) => ({
        _id,
        sku,
        name,
        pricing,
        quantity: faker.datatype.number({ min: 1, max: 10 }),
      })),
    ],
    shipping_address: faker.random.arrayElement(user.addresses), // TODO форматирвоать инфу об адресе
    sub_total: orderingProducts.reduce((prev, el) => prev + el.pricing.retail, 0),
  };
};

module.exports = order;

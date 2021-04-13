const faker = require('faker');
const { ObjectId } = require('mongodb');
const { arrayOfRandomCountObjects } = require('./generators');

const getSlug = (sku, name) => faker.helpers.slugify(`${name} ${sku}`).toLowerCase();

const getPricing = (start) => {
  const date = new Date(Date.parse(start));

  const range = {
    min: 1000,
    max: (faker.datatype.number(2)+1) * 365 * 24 * 3600 * 1000,
  };

  let past = date.getTime();
  past += faker.datatype.number(range);
  date.setTime(past);
  date.setHours(0, 0, 0, 0);

  const retail = faker.datatype.number();

  return {
    retail,
    sale: retail*0.9,
    start,
    end: date,
  };
};

const getPricingHistory = (start) => {
  const len = faker.datatype.number({ min: 2, max: 5 });
  const history = [getPricing(start)];
  for (let i = 0; history.length !== len; i++) {
    const newStart = new Date(Date.parse(history[i].end));
    newStart.setDate(newStart.getDate()+1);
    history.push(getPricing(newStart));
  }
  return history;
};

const product = (categories = []) => {
  const category_ids = faker.random.arrayElements(categories, faker.datatype.number(4)+1).map(({ _id }) => _id);
  const main_cat_id = faker.random.arrayElement(category_ids) || null;
  const sku = faker.datatype.number();
  const name = faker.commerce.productName();
  const retail = faker.datatype.number();
  return {
    _id: new ObjectId(),
    slug: getSlug(sku, name),
    sku,
    name,
    description: faker.commerce.productDescription(),
    details: {
      weight: faker.datatype.number(40)+10,
      weight_units: 'lbs',
      model_num: faker.datatype.number(),
      manufactured: faker.random.word(),
      color: faker.commerce.color(),
    },
    total_reviews: 0,
    average_review: null,
    pricing: {
      retail,
      sale: retail*0.9,
    },
    pricing_history: getPricingHistory(new Date(2015, 1, 1)),
    category_ids,
    main_cat_id,
    tags: arrayOfRandomCountObjects(6, faker.random.word),
  };
};

module.exports = product;

const faker = require('faker');
const { ObjectId } = require('mongodb');

const categoryName = (name) => ({
  name,
  slug: faker.helpers.slugify(name).toLowerCase(),
});

const getAncestors = (categories = [], parent_id) => {
  if (!parent_id) return [];
  const parent = categories.find(el => String(el._id) === String(parent_id));
  return [parent, ...getAncestors(categories, parent.parent_id)];
};

const category = (categories = []) => {
  const { name, slug } = categoryName(faker.commerce.department());
  const parent_id = faker.random.arrayElement(categories)?._id || null;
  const ancestors = getAncestors(categories, parent_id).map(({ _id, slug, name }) => ({ _id, slug, name }));
  const category = {
    _id: new ObjectId(),
    slug,
    name,
    description: faker.lorem.text(),
    ancestors,
    parent_id: parent_id,
  };
  categories.push(category);
  return category;
};

module.exports = category;

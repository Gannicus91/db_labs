const faker = require('faker');
const { ObjectId } = require('mongodb');

const addVoteToProduct = (product) => product.total_reviews++;
const calcAverageReview = (product, reviews, rating) => {
  const productRatings = reviews.reduce(
    (prev, el) =>
      el.product_id === product._id
        ? prev + el.rating
        : prev,
    0);
  product.average_review = (productRatings + rating) / product.total_reviews;
};

const review = (users, products, reviews) => {
  if (!users || !products) return;

  const product = faker.random.arrayElement(products);
  const user = faker.random.arrayElement(users);
  const voter_ids = faker.random.arrayElements(users, faker.datatype.number(10)).map(({ _id }) => _id);
  const rating = faker.datatype.number({ min: 1, max: 5 });

  addVoteToProduct(product);
  calcAverageReview(product, reviews, rating);

  const review = {
    _id: new ObjectId(),
    product_id: product._id,
    date: faker.date.past(),
    title: faker.lorem.word(),
    text: faker.lorem.sentence(),
    rating,
    user_id: user._id,
    username: user.username,
    helpful_votes: voter_ids.length,
    voter_ids,
  };
  reviews.push(review);

  return review;
};

module.exports = review;

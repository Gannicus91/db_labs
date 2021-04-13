const { db, ObjectId } = require('mongodb');

db.users.find({ _id: ObjectId('60618640e8296e17bf75e8d9') }); // 1
// edit doc
db.users.updateOne({ _id: ObjectId('60618640e8296e17bf75e8d9') }, { /* edited doc */ }); // 1

db.users.updateOne({ _id: ObjectId('6065b15dd789c748de91f0c6') }, { $set: { email: 'admin@dev.ru' }}); // 2

db.users.updateOne(
  { _id: ObjectId('6065b15dd789c748de91f0c6') },
  { $push: { adresses: {}}},
); // 3

// start 4
db.users.find({ _id: ObjectId('60618640e8296e17bf75e8d9') }); // 4
// edit doc
db.users.updateOne(
  { _id: ObjectId('60618640e8296e17bf75e8d9') },
  { /* edited doc */ },
); // 4
// end 4

// start 5
const review = {
  _id: new ObjectId(),
  product_id: ObjectId('6065b15dd789c748de91f10c'),
  date: new Date(),
  title: 'Good',
  text: 'Gods is good',
  rating: 5,
  user_id: ObjectId('6065b15dd789c748de91f0c6'),
  username: 'Jaydon_Gibson17',
  helpful_votes: 0,
  voter_ids: [],
}; // 5
db.reviews.insertOne(review); // 5
db.products.aggregate([
  {
    $match: { _id: review.product_id },
  },
  {
    $project: {
      total_reviews: 1,
      average_review: { $ifNull: ['$average_review', 0] },
    },
  },
  {
    $set: {
      total_reviews: { $add: ['$total_reviews', 1] },
      average_review: {
        $divide: [
          {
            $add: [
              { $multiply: ['$average_review', '$total_reviews'] },
              review.rating,
            ],
          },
          { $add: ['$total_reviews', 1] },
        ],
      },
    },
  },
]); // 5
db.products.updateOne({
  _id: review.product_id,
}, {
  $inc: { total_reviews: 1 },
  $set: {
    average_review: 5, // computed value
  },
}); // 5
// end 5

// start 6
db.categories.updateOne({
  _id: ObjectId('6065b15dd789c748de91f0fa'),
}, { $set: { name: 'Anime' }}); // 6
db.categories.updateMany({
  'ancestors._id': ObjectId('6065b15dd789c748de91f0fa'),
}, { $set: { 'ancestors.$.name': 'Anime' }}); // 6
// end 6

db.orders.updateOne({ _id: ObjectId('6065b15ed789c748de91f3c8') }, { $set: { state: 'PREPARING_FOR_SHIPMENT' }}); // 9

db.products.updateOne({ sku: 75054 }, { $push: { category_ids: ObjectId('6065b15dd789c748de91f0f9') }}); // 10
db.products.updateOne({ sku: 75054 }, { $pull: { category_ids: ObjectId('6065b15dd789c748de91f0f9') }}); // 11
db.orders.updateOne({
  '_id': ObjectId('6065b15ed789c748de91f3c9'),
  'lines_items.sku': 75054,
}, {
  $set: {
    'lines_items.$.quantity': 7,
  },
}); // 12
db.reviews.remove({ user_id: ObjectId('60618640e8296e17bf75e8d9') }); // 13
db.users.createIndex(
  { sku: 1 },
  { sparse: true },
); // 14

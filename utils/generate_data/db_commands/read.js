const { db, ObjectId } = require('mongodb');

db.orders.find({ user_id: ObjectId('6061863fe8296e17bf75e792') }); // 1
db.orders.aggregate([
  {
    $match: { _id: ObjectId('6065b15ed789c748de91f3c8') },
  },
  {
    $project: {
      user_id: 1,
    },
  },
  {
    $lookup: {
      from:'users',
      localField:'user_id',
      foreignField:'_id',
      as: 'user',
    },
  },
  {
    $project: {
      user: { $arrayElemAt: [ '$user', 0 ] },
    },
  },
]); //2
db.products.findOne({ slug: 'sleek-fresh-towels-30781' }); // 3
db.products.aggregate([
  {
    $match: { slug: 'sleek-fresh-towels-30781' },
  },
  {
    $project: {
      main_cat_id: 1,
    },
  },
  {
    $lookup: {
      from:'categories',
      localField:'main_cat_id',
      foreignField:'_id',
      as: 'main_cat',
    },
  },
  {
    $project: {
      main_cat: { $arrayElemAt: [ '$main_cat', 0 ] },
    },
  },
]); // 4

db.products.aggregate([
  {
    $lookup: {
      from:'categories',
      localField:'category_ids',
      foreignField:'_id',
      as: 'categories',
    },
  },
  {
    $match: {
      categories: { $elemMatch: { name: 'Home' }},
    },
  },
]); // 5

db.reviews.find({ product_id: ObjectId('6061863fe8296e17bf75e7b7') }); // 6

db.reviews.find({ product_id: ObjectId('6061863fe8296e17bf75e853') }).sort({ helpful_votes: -1 }); // 7

db.categories.aggregate([
  {
    $lookup: {
      from: 'products', // secondary collection name containing references to _id of 'a'
      localField: '_id',  // the _id field of the 'a' collection
      foreignField: 'category_ids', // the referencing field of the 'b' collection
      as: 'references',
    },
  },
  {
    $match: {
      references: [],
      parent_id: null,
    },
  },
  {
    $project: {
      references: 0,
    },
  },
]); // 8

db.users.find({
  'addresses.city': 'Doylefort',
}); // 9.1
db.users.find({
  'addresses.zip': {
    $in: ['94606-1040', '05814-1164', '11362', '31140-0866'],
  },
}); // 9.2
// TODO:10
// TODO:11

db.products.find({ main_cat_id: { $ne: null }}); // 12

db.products.find({ $or: [{ 'details.color': 'blue' }, { 'details.manufactured': 'program' }] }); // 13

db.products.find({ tags: { $all: ['rich', 'Shoes'] }}); // 14

db.products.find({ 'details.manufactured': 'Avon', 'tags': { $nin: ['rich'] }}); // 15

db.users.find({ last_name: { $regex: '[^B].*' }}); // 16

db.products.find({ $and: [{ tags: { $in: ['rich', 'garden'] }}, { tags: { $in: ['Shoes', 'sofa'] }}] }); // 17

db.products.find({ $or: [{ 'details.color': { $exists: false }}, { 'details.color': null }] }); // 18

db.products.find({ tags: 'Shoes' }); // 19

db.users.find({ 'addresses.0.city': 'Goldnerport' }); // 20

db.users.find({ 'addresses.city': 'North Merritt' }); // 21

db.users.find({ addresses: { $size: 3 }}); // 22

db.reviews.find({
  text: {
    $regex: /quidem|sit/i,
  },
}); // 23

db.users.find({ _id: { $type: 'string' }}); // 24

db.reviews.find().sort({ date: 1 }).limit(12); // 25.1
db.reviews.find().sort({ date: 1 }).skip(db.reviews.count() - 5); // 25.2

db.reviews.find().skip(25).limit(12); // 26

db.reviews.aggregate([
  {
    $match: { user_id: ObjectId('6065b15dd789c748de91f0ed') },
  },
  {
    $project: {
      helpful_votes: 1,
    },
  },
  {
    $group: {
      _id: null,
      sum: {
        $sum: '$helpful_votes',
      },
    },
  },
  {
    $project: {
      _id: 0,
    },
  },
]); // 27.1
db.reviews.aggregate([
  {
    $project: {
      user_id: 1,
      helpful_votes: 1,
    },
  },
  {
    $group: {
      _id: '$user_id',
      votes_sum: {
        $sum: '$helpful_votes',
      },
    },
  },
  {
    $group: {
      _id: null,
      average_votes: {
        $avg: '$votes_sum',
      },
    },
  },
  {
    $project: {
      _id: 0,
    },
  },
]); // 27.2

// TODO:28 нет даты продажи товара

db.reviews.find().sort({ helpful_votes: -1 }).limit(1); // 29

db.products.aggregate([
  {
    $lookup: {
      from:'categories',
      localField:'category_ids',
      foreignField:'_id',
      as: 'categories',
    },
  },
  {
    $match: { categories: { $elemMatch: { name: 'Home' }}},
  },
  {
    $project: {
      tags: 1,
    },
  },
  {
    $addFields: {   // новое поле nums
      all_tags: {
        $concatArrays: [  // соберем из tags
          '$tags',
        ],
      },
    },
  },
  {
    $project: {  // только оно нам нужно
      all_tags: 1,
    },
  },
  {
    $unwind: {  // ВСЕ номера
      path: '$all_tags',
    },
  },
  {
    $match: {  // уберем пустые строки и null и прочий мусор
      all_tags: {
        $type: 'string',
      },
    },
  },
  {
    $group: {  // addToSet то есть только уникальные
      _id: null,
      all_tags: {
        $addToSet: '$all_tags',
      },
    },
  },
]); // 30

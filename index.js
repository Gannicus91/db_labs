const { MongoClient, Server, ObjectID } = require('mongodb');
const faker = require('faker');
const { arrayOfObjects, user, category, product, review, order } = require('./utils/generate_data');

async function main() {
  const client = new MongoClient(new Server('localhost', 27018));

  try {
    await client.connect();
    const db = client.db('labs_database');

    const users = arrayOfObjects(50, user);
    const categories = arrayOfObjects(20, category, [[]]);
    const products = arrayOfObjects(200, product, [categories]);
    const reviews = arrayOfObjects(500, review, [users, products, []]);
    const orders = arrayOfObjects(100, order, [users, products]);

    const usersCollection = db.collection('users');
    const categoriesCollection = db.collection('categories');
    const productsCollection = db.collection('products');
    const reviewsCollection = db.collection('reviews');
    const ordersCollection = db.collection('orders');

    await usersCollection.insertMany(users);
    await categoriesCollection.insertMany(categories);
    await productsCollection.insertMany(products);
    await reviewsCollection.insertMany(reviews);
    await ordersCollection.insertMany(orders);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

//
// const users = arrayOfObjects(50, user);
// const categories = arrayOfObjects(20, category, []);
// const products = arrayOfObjects(1, product, [categories]);
// const reviews = arrayOfObjects(10, review, [users, products, []]);
// const orders = arrayOfObjects(50, order, [users, products]);
//
// console.log(reviews);
// console.log(products);

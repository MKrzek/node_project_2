const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');

module.exports = class Product {
  constructor(title, price, imageURL, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
    this._id = id ? ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log('result-saving', result);
      })
      .catch(err => {
        console.log('error-saving', err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => products)
      .catch(err => {
        console.log('err', err);
      });
  }

  static findById(productId) {
    const db = getDb();

    return db
      .collection('products')
      .findOne({ _id: ObjectId(productId) })

      .then(product => product)
      .catch(err => {
        console.log('err', err);
      });
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: ObjectId(productId) })
      .then(result => console.log('deleted'))
      .catch(err => console.log('err', err));
  }
};

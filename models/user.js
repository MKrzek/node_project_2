const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(user => user)
      .catch(err => console.log('err', err));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: ObjectId(id) })
      .then(user => user)
      .catch(err => console.log('err', err));
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.productId.toString() === product._id.toString()
    );
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    return db
      .collection('users')
      .updateOne({ _id: ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => item.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products =>
        products.map(product => ({
          ...product,
          quantity: this.cart.items.find(
            item => item.productId.toString() === product._id.toString()
          ).quantity,
        }))
      );
  }

  deleteFromCart(id) {
    const db = getDb();
    const updatedCart = this.cart.items.filter(
      item => item.productId.toString() !== id.toString()
    );
    return db
      .collection('users')
      .updateOne(
        { _id: ObjectId(this._id) },
        { $set: { cart: { items: updatedCart } } }
      )
      .then(cart => cart)
      .catch(err => console.log('deleting-from-cart', err));
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: { _id: ObjectId(this._id), name: this.name, email: this.email },
        };
        return db.collection('orders').insertOne(order);
      })
      .then(() =>
        db
          .collection('users')
          .updateOne(
            { _id: ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          )
          .then(cart => cart)
          .catch(err => console.log('deleting-from-cart', err))
      );
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': ObjectId(this._id) })
      .toArray()
      .then(orders => {
        console.log('orders', orders);
        return orders;
      })
      .catch(err => console.log('err', err));
  }
}
module.exports = User;

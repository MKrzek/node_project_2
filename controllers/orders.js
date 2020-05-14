const Order = require('../models/order');
const User = require('../models/user');

const createOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log('user', user);
      const products = user.cart.items.map(i => ({
        quantity: i.quantity,
        product: i.productId,
      }));
      console.log('products', products);
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
        products,
      });
      console.log('order', order);
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log('order-error', err));
};

const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .lean()
    .populate('products.product')
    .then(orders => {
      console.log('orders', orders);
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        activeOrders: true,
        orderCSS: true,
        hasOrders: orders.length > 0,
        orders,
      });
    })
    .catch(err => console.log('err', err));
};

module.exports = { getOrders, createOrder };

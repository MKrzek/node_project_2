const Order = require('../models/order');

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

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products,
      });

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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log('err', err));
};

module.exports = { getOrders, createOrder };

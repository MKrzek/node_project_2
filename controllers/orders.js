const createOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log('order-error', err));
};

const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
    activeOrders: true,
  });
};

module.exports = { getOrders, createOrder };

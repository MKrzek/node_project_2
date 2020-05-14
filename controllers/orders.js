const createOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log('order-error', err));
};

const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
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

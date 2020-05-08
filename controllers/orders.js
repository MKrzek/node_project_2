const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
    activeCart: true,
  });
};

module.exports = getOrders;

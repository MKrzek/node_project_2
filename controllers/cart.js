const getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    activeCart: true,
  });
};

module.exports = getCart;

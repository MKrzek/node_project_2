const Product = require('../models/product');

const getCart = (req, res, next) => {
  req.user.getCart().then(cart => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      activeCart: true,
      products: cart,
      hasProducts: cart.length > 0,
      cartCSS: true,
    });
  });
};

const addToCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => req.user.addToCart(product))
    .then(() => {
      res.redirect('/cart');
    });
};
const deleteCartProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

module.exports = { getCart, addToCart, deleteCartProduct };

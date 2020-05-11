const Product = require('../models/product');
const Cart = require('../models/cart');

const getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    activeCart: true,
  });
};

const addToCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProducts(productId, product.price);
  });
  res.redirect('/cart');
};

module.exports = { getCart, addToCart };

const Product = require('../models/product');
const User = require('../models/user');

const getCart = (req, res, next) => {
  console.log('reqqq-user', req.user);
  User.findById(req.user._id)
    .lean()
    .populate('cart.items.productId')
    .then(user => {
      const {
        cart: { items },
      } = user;
      console.log('items', items);
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        activeCart: true,
        products: items,
        hasProducts: items.length > 0,
        cartCSS: true,
      });
    });
};

const addToCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => req.user.addToCart(product))
    .then(result => res.redirect('/cart'));
};

const deleteCartProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

module.exports = { getCart, addToCart, deleteCartProduct };

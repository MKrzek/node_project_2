const Product = require('../models/product');
const Cart = require('../models/cart');

const getCart = (req, res, next) => {
  Cart.getCartProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        activeCart: true,
        products: cartProducts,
        hasProducts: cartProducts.length > 0,
      });
    });
  });
};

const addToCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProducts(productId, product.price);
  });
  res.redirect('/cart');
};
const deleteCartProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, product => {
    console.log('priceeeeeee-deleting', product);
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

module.exports = { getCart, addToCart, deleteCartProduct };

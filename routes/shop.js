const express = require('express');
const {
  getProducts,
  getIndex,
  getProductDetails,
} = require('../controllers/shop');
const {
  getCart,
  addToCart,
  deleteCartProduct,
} = require('../controllers/cart');
const getCheckout = require('../controllers/checkout');
const getOrders = require('../controllers/orders');

const router = express.Router();

router.get('/', getIndex);
router.get('/products/:productId(\\d+)', getProductDetails);
router.get('/products', getProducts);

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.post('/cart-delete-item', deleteCartProduct);
router.get('/checkout', getCheckout);
router.get('/orders', getOrders);

module.exports = router;

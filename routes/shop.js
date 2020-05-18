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
const { getOrders, createOrder } = require('../controllers/orders');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', getIndex);
router.get('/products/:productId', getProductDetails);
router.get('/products', getProducts);

router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, addToCart);
router.post('/cart-delete-item', isAuth, deleteCartProduct);
// router.get('/checkout', getCheckout);
router.get('/orders', isAuth, getOrders);
router.post('/create-order', isAuth, createOrder);

module.exports = router;

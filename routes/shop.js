const express = require('express');
const { getProducts, getIndex } = require('../controllers/shop');
const getCart = require('../controllers/cart');
const getCheckout = require('../controllers/checkout');
const getOrders = require('../controllers/orders');

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/cart', getCart);
router.get('/checkout', getCheckout);
router.get('/orders', getOrders);
// router.get('/products/:id', getProductDetail);

module.exports = router;

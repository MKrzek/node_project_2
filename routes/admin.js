const express = require('express');
const { getAddProduct, postAddProduct } = require('../controllers/product');

const adminRoutes = express.Router();

adminRoutes.get('/add-product', getAddProduct);

adminRoutes.post('/add-product', postAddProduct);

module.exports = adminRoutes;

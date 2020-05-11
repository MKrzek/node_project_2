const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
} = require('../controllers/admin');

const adminRoutes = express.Router();

adminRoutes.get('/add-product', getAddProduct);

adminRoutes.post('/add-product', postAddProduct);
adminRoutes.put('/edit-product/:productId(\\d+)', editProduct);
adminRoutes.get('/products', getAllProducts);

module.exports = adminRoutes;

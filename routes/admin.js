const express = require('express');
const { getAllProducts } = require('../controllers/admin');
const {
  getAddProduct,
  postAddProduct,
  editProduct,
} = require('../controllers/admin');

const adminRoutes = express.Router();

adminRoutes.get('/add-product', getAddProduct);

adminRoutes.post('/add-product', postAddProduct);
adminRoutes.put('/edit-product', editProduct);
adminRoutes.get('/products', getAllProducts);

module.exports = adminRoutes;

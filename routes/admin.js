const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
  saveEditProduct,
  deleteProduct,
} = require('../controllers/admin');

const adminRoutes = express.Router();

adminRoutes.get('/add-product', getAddProduct);

adminRoutes.post('/add-product', postAddProduct);
adminRoutes.get('/edit-product/:productId', editProduct);
adminRoutes.post('/edit-product', saveEditProduct);
adminRoutes.get('/delete-product/:productId', deleteProduct);
adminRoutes.get('/products', getAllProducts);

module.exports = adminRoutes;

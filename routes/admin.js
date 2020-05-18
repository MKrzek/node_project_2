const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
  saveEditProduct,
  deleteProduct,
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const adminRoutes = express.Router();

adminRoutes.get('/add-product', isAuth, getAddProduct);

adminRoutes.post('/add-product', isAuth, postAddProduct);
adminRoutes.get('/edit-product/:productId', isAuth, editProduct);
adminRoutes.post('/edit-product', isAuth, saveEditProduct);
adminRoutes.get('/delete-product/:productId', isAuth, deleteProduct);
adminRoutes.get('/products', isAuth, getAllProducts);

module.exports = adminRoutes;

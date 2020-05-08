const express = require('express');

// const rootDir = require('../utils/path');

const adminRouter = express.Router();
const products = [];

adminRouter.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    productAddCSS: true,
  });
});

adminRouter.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  console.log('pppp', products);
  res.redirect('/');
});

module.exports = { adminRouter, products };

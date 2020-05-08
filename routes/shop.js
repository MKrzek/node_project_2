const express = require('express');

// const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('adminData', adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', {
    products: adminData.products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: adminData.products > 0,
    activeShop: true,
  });
});

module.exports = router;

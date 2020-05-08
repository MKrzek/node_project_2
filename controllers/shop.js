const Product = require('../models/product');

const getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
    });
  });
};

const getIndex = (req, res, next) => {
  res.render('shop/index', {
    path: '/',
    pageTitle: 'Main Page',
    activeShop: true,
  });
};

module.exports = { getProducts, getIndex };

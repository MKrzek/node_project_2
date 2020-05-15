const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.find()
    .lean()
    .then(products => {
      console.log('prducts', products);
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        hasProducts: products && products.length > 0,
        activeProducts: true,
      });
    });
};

const getIndex = (req, res, next) => {
  res.render('shop/index', {
    path: '/',
    pageTitle: 'Main Page',
    activeShop: true,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getProductDetails = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .lean()
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log('product-detail-error', err));
};

module.exports = { getProducts, getIndex, getProductDetails };

const Product = require('../models/product');

const ITEMS_PER_PAGE = 2;

const getProducts = (req, res, next) => {
  const { page } = req.query;

  Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .lean()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',

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
      });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = { getProducts, getIndex, getProductDetails };

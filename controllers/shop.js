const Product = require('../models/product');

const ITEMS_PER_PAGE = 2;

const getProducts = (req, res, next) => {
  const page = req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .lean()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        hasProducts: products && products.length > 0,
        activeProducts: true,
        currentPage: page,

        totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: parseInt(page) + 1,
        prevPage: parseInt(page) - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        comp1: parseInt(page) !== 1,
        comp2: parseInt(page) - 1 !== 1,
        comp3: Math.ceil(totalItems / ITEMS_PER_PAGE) !== parseInt(page),
        comp4: parseInt(page) + 1 !== Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(err => console.log('err', err));
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

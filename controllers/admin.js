const { validationResult } = require('express-validator');
const Product = require('../models/product');

const getAllProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .lean()
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0,
        activeAdminProduct: true,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req, res, next) => {
  const { title, price, imageURL, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      productCSS: true,
      errorMessage: errors.array()[0].msg,
      validationStyles: errors.mapped(),
      product: {
        title,
        price,
        imageURL,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    imageURL,
    description,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const editProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .lean()
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        productCSS: true,
        errorMessage: null,
        product,
      });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const saveEditProduct = (req, res, next) => {
  const { productId, title, price, imageURL, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      productCSS: true,
      errorMessage: errors.array()[0].msg,
      validationStyles: errors.mapped(),
      product: {
        title,
        price,
        imageURL,
        description,
        _id: productId,
      },
    });
  }

  return Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      return Product.updateOne(
        {
          _id: productId,
        },
        { title, price, imageURL, description }
      ).then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
  saveEditProduct,
  deleteProduct,
};

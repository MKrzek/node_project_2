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
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log('err', err);
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
        product,
      });
    });
};

const saveEditProduct = (req, res, next) => {
  const { productId, title, price, imageURL, description } = req.body;
  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      Product.update(
        {
          _id: productId,
        },
        { title, price, imageURL, description }
      ).then(result => {
        res.redirect('/admin/products');
      });
    })
    .catch(err => console.log('err-did-not-find product', err));
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.deleteOne({ _id: productId, userId: req.user._id }).then(() =>
    res.redirect('/admin/products')
  );
};

module.exports = {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
  saveEditProduct,
  deleteProduct,
};

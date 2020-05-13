const Product = require('../models/product');

const getAllProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeAdminProduct: true,
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

  const product = new Product(
    title,
    price,
    imageURL,
    description,
    null,
    req.user._id
  );
  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log('err', err);
    });
};

const editProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId).then(product => {
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
  const updatedProduct = new Product(
    title,
    price,
    imageURL,
    description,
    productId
  );
  updatedProduct.save().then(result => {
    res.redirect('/admin/products');
  });
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.deleteById(productId).then(() => res.redirect('/admin/products'));
};

module.exports = {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
  saveEditProduct,
  deleteProduct,
};

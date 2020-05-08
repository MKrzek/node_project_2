const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    productAddCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req, res, next) => {
  const { title, price, imageURL, description } = req.body;
  const product = new Product(price, title, imageURL, description);
  console.log('produyct', product);
  product.save();
  res.redirect('/');
};

const editProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: 'admin/edit-product',
  });
};

const getAllProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin All Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeAdminProduct: true,
    });
  });
};
module.exports = { getAddProduct, postAddProduct, editProduct, getAllProducts };

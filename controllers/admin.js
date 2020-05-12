const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    productCSS: true,
    activeAddProduct: true,
  });
};

const postAddProduct = (req, res, next) => {
  const { title, price, imageURL, description } = req.body;

  const product = new Product(null, title, price, imageURL, description);
  product.save();
  res.redirect('/');
};

const editProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, product => {
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

const deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.delete(productId);
  res.redirect('/admin/products');
};
const saveEditProduct = (req, res, next) => {
  const { productId, title, price, imageURL, description } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    price,
    imageURL,
    description
  );
  updatedProduct.save();
  res.redirect('/admin/products');
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

module.exports = {
  getAddProduct,
  postAddProduct,
  editProduct,
  getAllProducts,
  saveEditProduct,
  deleteProduct,
};

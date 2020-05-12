const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, price, imageURL, description) {
    this.id = id || Math.ceil(Math.random() * 1000).toString();
    this.title = title;
    this.price = price;
    this.imageURL = imageURL;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      const existingProductIndex = products.findIndex(
        product => product.id === this.id
      );
      console.log('existing priduct', existingProductIndex);
      if (existingProductIndex !== -1) {
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err =>
          console.log(err)
        );
      } else {
        console.log('this', this);
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => console.log(err));
      }
    });
  }

  static delete(productId) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === productId);
      const productsFiltered = products.filter(prod => prod.id !== productId);
      console.log('produtsAfterDeleteion', productsFiltered);
      fs.writeFile(p, JSON.stringify(productsFiltered), err => {
        if (!err) {
          Cart.deleteProduct(productId, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      cb(product);
    });
  }
};

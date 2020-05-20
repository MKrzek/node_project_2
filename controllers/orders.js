const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Order = require('../models/order');

const createOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => ({
        quantity: i.quantity,
        product: i.productId,
      }));

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products,
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .lean()
    .populate('products.product')
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        activeOrders: true,
        orderCSS: true,
        hasOrders: orders.length > 0,
        orders,
      });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .populate('products.product')
    .lean()

    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      });
      pdfDoc.text('-----------------------------');
      let totalPrice = 0;

      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;

        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} x £${prod.product.price}`
          );
      });
      pdfDoc.text('----');
      pdfDoc.fontSize(20).text(`Total Price: £${totalPrice}`);

      pdfDoc.end();
    })

    .catch(err => next(err));
};

module.exports = { getOrders, createOrder, getInvoice };

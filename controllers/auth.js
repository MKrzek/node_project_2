const User = require('../models/user');

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    activeLogin: true,
    loginCSS: true,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  User.findById('5ebd42bb32d6d912ee67c759').then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      res.redirect('/');
    });
  });
};
const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
module.exports = { getLogin, postLogin, postLogout };

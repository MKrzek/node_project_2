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
const getSignUp = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign-Up',
    path: '/signup',
    loginCSS: true,
    activeSignup: true,
  });
};

const postSignUp = (req, res, next) => {};
module.exports = { getLogin, postLogin, postLogout, getSignUp, postSignUp };

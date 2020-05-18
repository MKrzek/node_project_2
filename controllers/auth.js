const bcrypt = require('bcryptjs');
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
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) return res.redirect('/login');
    bcrypt
      .compare(password, user.password)
      .then(matchFound => {
        if (matchFound) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => res.redirect('/'));
        }
        res.redirect('/login');
      })
      .catch(err => {
        console.log('err', err);
        return res.redirect('/login');
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
    isAuthenticated: false,
  });
};

const postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser
            .save()
            .then(() => res.redirect('/login'))
            .catch(err => console.log('err', err));
        })
        .catch(err => console.log('err', err));
    })

    .catch(err => console.log('err', err));
};

module.exports = { getLogin, postLogin, postLogout, getSignUp, postSignUp };

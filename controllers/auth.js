const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/user');
const {
  SENDGRID_API_KEY,
  // MAIL_HOST,
  // MAIL_PASSWORD,
  // MAIL_PORT,
  // MAIL_USER,
} = require('../.env');

// const transport = nodemailer.createTransport({
//   host: MAIL_HOST,
//   port: MAIL_PORT,
//   auth: {
//     user: MAIL_USER,
//     pass: MAIL_PASSWORD,
//   },
// });

sgMail.setApiKey(SENDGRID_API_KEY);

const getLogin = (req, res, next) => {
  const message = req.flash('error');

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    activeLogin: true,
    loginCSS: true,
    oldInput: {
      email: '',
      password: '',
    },
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      activeLogin: true,
      loginCSS: true,
      validationStyles: errors.mapped(),
      oldInput: { email, password },
    });
  }
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        activeLogin: true,
        loginCSS: true,
        validationStyles: { email: '', password: '' },
        oldInput: {
          email,
          password,
        },
      });
    }
    bcrypt
      .compare(password, user.password)
      .then(matchFound => {
        if (matchFound) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => res.redirect('/'));
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          activeLogin: true,
          loginCSS: true,
          validationStyles: {
            email: '',
            password: '',
          },
          oldInput: {
            email,
            password,
          },
        });
      })
      .catch(err => res.redirect('/login'));
  });
};

const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const getSignUp = (req, res, next) => {
  const message = req.flash('error');
  res.render('auth/signup', {
    pageTitle: 'Sign-Up',
    path: '/signup',
    loginCSS: true,
    errorMessage: message,
    activeSignup: true,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationStyles: [],
  });
};

const postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign-Up',
      errorMessage: errors.array()[0].msg,
      loginCSS: true,
      activeSignup: true,
      oldInput: { email, password, confirmPassword },
      validationStyles: errors.mapped(),
    });
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
        .then(() => {
          res.redirect('/login');
          return sgMail.send({
            to: email,
            from: 'shop@node-complete.com',
            subject: 'Sign-up has been successful',
            html: '<h1>You have successfully signed up</h1>',
          });
        })
        .catch(err => {
          const error = new Error();
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getReset = (req, res, next) => {
  const message = req.flash('error');
  res.render('auth/password-reset', {
    pageTitle: 'Reset Password',
    path: '/password-reset',
    loginCSS: true,
    errorMessage: message,
  });
};
const postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect('/password-reset');
    const token = buffer.toString('hex');
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/password-reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        sgMail.send({
          to: email,
          from: 'shop@node-complete.com',
          subject: 'Password Reset',
          html: `<p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/password-reset/${token}">link</a> to set a new password</p>
          `,
        });
      })
      .catch(err => {
        const error = new Error();
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

const getNewPassword = (req, res, next) => {
  const { resetToken } = req.params;

  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      const message = req.flash('error');
      res.render('auth/new-password', {
        pageTitle: 'Set New Password',
        path: '/new-password',
        loginCSS: true,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: resetToken,
      });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

const saveNewPassword = (req, res, next) => {
  const { password, userId, resetToken } = req.body;

  let resetUser;

  User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(user => {
      bcrypt.hash(password, 12);
      resetUser = user;
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser
        .save()
        .then(() => {
          res.redirect('/login');
        })
        .catch(err => {
          const error = new Error();
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  getNewPassword,
  saveNewPassword,
};

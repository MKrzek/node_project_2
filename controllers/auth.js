const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

const getLogin = (req, res, next) => {
  const message = req.flash('error');

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    activeLogin: true,
    loginCSS: true,
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    bcrypt
      .compare(password, user.password)
      .then(matchFound => {
        if (matchFound) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => res.redirect('/'));
        }
        req.flash('error', 'Invalid email or password');
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
  const message = req.flash('error');
  res.render('auth/signup', {
    pageTitle: 'Sign-Up',
    path: '/signup',
    loginCSS: true,
    errorMessage: message,
    activeSignup: true,
  });
};

const postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash(
          'error',
          'This email already exists, please pick a different email'
        );
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
            .then(() => {
              res.redirect('/login');
              return transporter.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                subject: 'Sign-up has been successful',
                html: '<h1>You have successfully signed up</h1>',
              });
            })
            .catch(err => console.log('err', err));
        })
        .catch(err => console.log('err', err));
    })

    .catch(err => console.log('err', err));
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
  console.log('reseteiamil', email);
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
        transporter.sendMail({
          to: email,
          from: 'shop@node-complete.com',
          subject: 'Password Reset',
          html: `<p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/password-reset/${token}">link</a> to set a new password</p>
          `,
        });
      })
      .catch(err => console.log(err));
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
    .catch(err => console.log('err', err));
};

const saveNewPassword = (req, res, next) => {
  const { password, userId, resetToken } = req.body;
  console.log('newwwww', password, userId, resetToken);
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
      return resetUser.save();
    })
    .catch(err => console.log('err', err));
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

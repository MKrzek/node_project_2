const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  getNewPassword,
  saveNewPassword,
} = require('../controllers/auth');

const router = express.Router();
router.get('/login', getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),

    body('password', 'Password has to be valid').isLength({ min: 2 }),
  ],
  postLogin
);
router.post('/logout', postLogout);
router.get('/signup', getSignUp);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) =>
        User.findOne({ email: value }).then(user => {
          if (user) {
            console.log('ussssss', user);
            return Promise.reject(
              'This email already exists, please pick a different email'
            );
          }
        })
      ),

    body(
      'password',
      'Please enter a password with only numbers and letters, and at least 5 characters'
    )
      .isLength({ min: 5 })
      .trim()
      .isAlphanumeric(),

    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
      }),
  ],
  postSignUp
);
router.get('/password-reset', getReset);
router.post('/password-reset', postReset);
router.get('/password-reset/:resetToken', getNewPassword);
router.post('/new-password', saveNewPassword);

module.exports = router;

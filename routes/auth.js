const express = require('express');
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
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/signup', getSignUp);
router.post('/signup', postSignUp);
router.get('/password-reset', getReset);
router.post('/password-reset', postReset);
router.get('/password-reset/:resetToken', getNewPassword);
router.post('/new-password', saveNewPassword);

module.exports = router;

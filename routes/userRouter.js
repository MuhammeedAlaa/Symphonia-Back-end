const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['email', 'user_friends', 'user_gender', 'user_birthday']
  })
);
router.get(
  '/auth/facebook/Symphonia',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope: ['email', 'user_friends', 'user_gender', 'user_birthday']
  }),
  authController.facebookOauth
);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  })
);

router.get(
  '/auth/google/Symphonia',
  passport.authenticate('google', {
    failureRedirect: '/login',
    scope: ['profile', 'email']
  }),
  authController.googleOauth
);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

// any endpoint written after the following line is protected
router.use(authController.protect);

router.post('/unlinkfacebook', authController.facebookUnlink);
router.post('/unlinkfacebook', authController.googleUnlink);
router.patch('/updatepassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/updateMe', userController.deleteMe);

module.exports = router;

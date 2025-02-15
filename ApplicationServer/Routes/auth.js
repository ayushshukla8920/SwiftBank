const express = require('express');
const router = express.Router();

const { handleLogin,verifyLoginOtp } = require('../controllers/login');
const { handleSignup,verifyOtp } = require('../controllers/signup');

router.post('/login',handleLogin);
router.post('/signup',handleSignup);
router.post('/verify-otp',verifyOtp);
router.post('/login/verify-otp',verifyLoginOtp);

module.exports = router;
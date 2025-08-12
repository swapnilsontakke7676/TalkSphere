const express = require('express');
const { registerUser, loginUser, verifyOtp, resetPassword, forgotPassword } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
const express = require('express');
const { registerUser, loginUser, verifyOtp, resetPassword, forgotPassword, allUsers, updateUserProfile, updateUserPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, allUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').put(protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.route('/password').put(protect, updateUserPassword);
router.post('/verify-reset-otp', verifyOtp);
router.post('/reset-password', resetPassword);
module.exports = router;
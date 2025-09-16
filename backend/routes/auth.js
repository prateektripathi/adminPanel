const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRequest, userSchemas } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRequest(userSchemas.register), register);
router.post('/login', validateRequest(userSchemas.login), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
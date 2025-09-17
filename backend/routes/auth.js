const express = require('express');
const router = express.Router();
const { login, register, me } = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, me);

module.exports = router;

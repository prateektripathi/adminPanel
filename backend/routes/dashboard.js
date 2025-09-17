const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { getStats } = require('../controllers/dashboardController');

router.get('/stats', protect, rbac(['admin']), getStats);

module.exports = router;

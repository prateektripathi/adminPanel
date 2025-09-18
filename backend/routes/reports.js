const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { getReports, customReport } = require('../controllers/reportController');

router.use(protect);

router.get('/', rbac(['admin']), getReports);
router.post('/custom', rbac(['admin']), customReport);

module.exports = router;

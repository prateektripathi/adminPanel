const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { list, create, markPaid, generateInvoice } = require('../controllers/paymentController');

router.use(protect);

router.get('/', rbac(['admin','staff','user']), list);
router.post('/', rbac(['admin','staff']), create);
router.post('/:id/mark-paid', rbac(['admin']), markPaid);
router.get('/:id/invoice', rbac(['admin','staff','user']), generateInvoice);

module.exports = router;

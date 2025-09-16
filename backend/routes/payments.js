const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  generateInvoice,
  sendPaymentReminder,
  processRefund,
  getPaymentStats,
  exportPayments
} = require('../controllers/paymentController');

const { protect, authorize, checkResourceAccess } = require('../middleware/auth');
const { validateRequest, paymentSchemas } = require('../middleware/validation');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin routes
router.get('/', authorize('admin', 'staff'), getPayments);
router.post('/', validateRequest(paymentSchemas.create), createPayment);
router.get('/stats', authorize('admin'), getPaymentStats);
router.get('/export', authorize('admin'), exportPayments);

// Payment specific routes
router.get('/:id', getPayment);
router.put('/:id', authorize('admin', 'staff'), updatePayment);
router.delete('/:id', authorize('admin'), deletePayment);
router.post('/:id/invoice', generateInvoice);
router.post('/:id/reminder', authorize('admin', 'staff'), sendPaymentReminder);
router.post('/:id/refund', authorize('admin'), processRefund);

module.exports = router;
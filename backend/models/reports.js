const express = require('express');
const {
  getReports,
  getReport,
  generateReport,
  updateReport,
  deleteReport,
  exportReport,
  scheduleReport,
  getReportStats
} = require('../controllers/reportController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin routes
router.get('/', authorize('admin', 'staff'), getReports);
router.post('/generate', authorize('admin', 'staff'), generateReport);
router.get('/stats', authorize('admin'), getReportStats);

// Report specific routes
router.get('/:id', getReport);
router.put('/:id', authorize('admin'), updateReport);
router.delete('/:id', authorize('admin'), deleteReport);
router.get('/:id/export', exportReport);
router.post('/:id/schedule', authorize('admin'), scheduleReport);

module.exports = router;
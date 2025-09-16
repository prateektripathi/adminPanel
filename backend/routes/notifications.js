const express = require('express');
const {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendBulkNotification
} = require('../controllers/notificationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// User notifications
router.get('/', getNotifications);
router.get('/:id', getNotification);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/', authorize('admin', 'staff'), createNotification);
router.post('/bulk', authorize('admin'), sendBulkNotification);

module.exports = router;
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  getNotifications,
  createNotification,
  markRead,
  deleteNotification
} = require('../controllers/notificationController');

router.use(protect);

router.get('/', getNotifications);
router.post('/', rbac(['admin']), createNotification); // only admin/system can create
router.put('/:id/read', markRead);
router.delete('/:id', rbac(['admin']), deleteNotification);

module.exports = router;

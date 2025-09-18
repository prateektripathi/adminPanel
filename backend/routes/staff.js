const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  assignUsers,
  getTaskHistory
} = require('../controllers/staffController');

// All routes require authentication
router.use(protect);

// Admin routes
router.get('/', rbac(['admin']), getStaff);
router.post('/', rbac(['admin']), createStaff);
router.put('/:id', rbac(['admin']), updateStaff);
router.delete('/:id', rbac(['admin']), deleteStaff);
router.post('/:id/assign-users', rbac(['admin']), assignUsers);

// Shared routes (admin + staff)
router.get('/:id', rbac(['admin', 'staff']), getStaffById);
router.get('/:id/tasks', rbac(['admin', 'staff']), getTaskHistory);

module.exports = router;

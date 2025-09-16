const express = require('express');
const {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  assignTasks,
  getStaffTasks,
  updateTaskStatus,
  getStaffPerformance,
  getStaffStats
} = require('../controllers/staffController');

const { protect, authorize } = require('../middleware/auth');
const { validateRequest, userSchemas } = require('../middleware/validation');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), getStaff);
router.post('/', authorize('admin'), validateRequest(userSchemas.register), createStaff);
router.get('/stats', authorize('admin'), getStaffStats);
router.get('/performance', authorize('admin'), getStaffPerformance);

// Admin and staff routes
router.get('/:id', getStaffMember);
router.put('/:id', authorize('admin'), updateStaff);
router.delete('/:id', authorize('admin'), deleteStaff);
router.post('/:id/assign-tasks', authorize('admin'), assignTasks);

// Staff routes
router.get('/:id/tasks', getStaffTasks);
router.put('/tasks/:taskId/status', updateTaskStatus);

module.exports = router;
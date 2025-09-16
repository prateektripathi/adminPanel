const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  assignStaff,
  bulkUploadUsers,
  exportUsers,
  getUserStats,
  updateUserProfile
} = require('../controllers/userController');

const { protect, authorize, checkResourceAccess } = require('../middleware/auth');
const { validateRequest, userSchemas } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.get('/', authorize('admin', 'staff'), getUsers);
router.post('/', authorize('admin'), validateRequest(userSchemas.register), createUser);
router.post('/bulk-upload', authorize('admin'), upload.single('file'), bulkUploadUsers);
router.get('/export', authorize('admin'), exportUsers);
router.get('/stats', authorize('admin', 'staff'), getUserStats);

// Admin and staff routes with resource access check
router.get('/:id', checkResourceAccess('user'), getUser);
router.put('/:id', checkResourceAccess('user'), validateRequest(userSchemas.updateProfile), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.post('/:id/assign-staff', authorize('admin'), assignStaff);

// User can update their own profile
router.put('/profile/me', validateRequest(userSchemas.updateProfile), updateUserProfile);

module.exports = router;
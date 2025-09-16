const express = require('express');
const {
  getBuckets,
  getBucket,
  createBucket,
  updateBucket,
  deleteBucket,
  addItemToBucket,
  removeItemFromBucket,
  updateBucketStatus,
  getBucketStats
} = require('../controllers/bucketController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin routes
router.get('/', getBuckets);
router.post('/', authorize('admin', 'staff'), createBucket);
router.get('/stats', authorize('admin'), getBucketStats);

// Bucket specific routes
router.get('/:id', getBucket);
router.put('/:id', authorize('admin', 'staff'), updateBucket);
router.delete('/:id', authorize('admin'), deleteBucket);
router.post('/:id/items', authorize('admin', 'staff'), addItemToBucket);
router.delete('/:id/items/:itemId', authorize('admin', 'staff'), removeItemFromBucket);
router.put('/:id/status', authorize('admin', 'staff'), updateBucketStatus);

module.exports = router;
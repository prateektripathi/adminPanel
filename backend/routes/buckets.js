const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  listBuckets,
  createBucket,
  updateBucket,
  deleteBucket
} = require('../controllers/bucketController');

router.use(protect);

// Admin: full access
router.get('/', rbac(['admin']), listBuckets);
router.post('/', rbac(['admin']), createBucket);
router.put('/:id', rbac(['admin']), updateBucket);
router.delete('/:id', rbac(['admin']), deleteBucket);

// Staff: only their assigned buckets (handled inside controller)
router.get('/staff', rbac(['staff']), listBuckets);
router.put('/:id/staff', rbac(['staff']), updateBucket);

// User: only their own orders (handled inside controller)
router.get('/user', rbac(['user']), listBuckets);

module.exports = router;

const asyncHandler = require('express-async-handler');
const BucketItem = require('../models/Bucket');

// List buckets (role-based filtering inside)
exports.listBuckets = asyncHandler(async (req, res) => {
  let filter = {};

  if (req.user.role === 'staff') {
    filter = { 'meta.staff': req.user._id };
  } else if (req.user.role === 'user') {
    filter = { user: req.user._id };
  }

  const buckets = await BucketItem.find(filter).sort({ date: -1 });
  res.json(buckets);
});

// Create bucket item (admin only)
exports.createBucket = asyncHandler(async (req, res) => {
  const bucket = await BucketItem.create(req.body);
  res.status(201).json(bucket);
});

// Update bucket item
exports.updateBucket = asyncHandler(async (req, res) => {
  const bucket = await BucketItem.findById(req.params.id);
  if (!bucket) return res.status(404).json({ message: 'Not found' });

  Object.assign(bucket, req.body);
  await bucket.save();
  res.json(bucket);
});

// Delete bucket
exports.deleteBucket = asyncHandler(async (req, res) => {
  await BucketItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bucket deleted' });
});

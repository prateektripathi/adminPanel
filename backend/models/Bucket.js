const mongoose = require('mongoose');

const bucketItemSchema = new mongoose.Schema({
  title: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  amount: Number,
  status: { type: String, enum: ['pending','inProgress','completed'], default: 'pending' },
  notes: String,
  date: Date
});

module.exports = mongoose.model('BucketItem', bucketItemSchema);

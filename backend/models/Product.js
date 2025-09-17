const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  stock: Number,
  price: Number,
  qualityStatus: String,
  pestInfo: String,
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  images: [String],
  testLogs: [{
    date: Date,
    result: String,
    notes: String,
    tester: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
  }],
  lastTested: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

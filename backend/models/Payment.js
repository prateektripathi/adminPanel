const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  amount: Number,
  status: { type: String, enum: ['pending','completed','refunded'], default: 'pending' },
  date: Date,
  invoice: String,
  method: String,
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

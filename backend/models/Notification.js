const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  read: { type: Boolean, default: false },
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notifSchema);

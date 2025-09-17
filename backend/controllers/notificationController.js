const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// Get notifications (role-based)
exports.getNotifications = asyncHandler(async (req, res) => {
  const role = req.user.role;
  let filter = {};

  if (role === 'staff') {
    filter = { 'meta.staff': req.user._id };
  } else if (role === 'user') {
    filter = { 'meta.user': req.user._id };
  }
  // Admin sees all notifications

  const notifs = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(notifs);
});

// Create notification (Admin use or system-triggered)
exports.createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, meta } = req.body;
  const notif = await Notification.create({ title, message, type, meta });
  res.status(201).json(notif);
});

// Mark as read
exports.markRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) return res.status(404).json({ message: 'Not found' });

  notif.read = true;
  await notif.save();
  res.json({ message: 'Marked as read', notif });
});

// Delete notification
exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
});

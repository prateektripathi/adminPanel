const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

exports.getStats = asyncHandler(async (req, res) => {
  const role = req.user.role;

  // Timeline (last 10 notifications for activity feed)
  const timeline = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title message type createdAt');

  // Role: Admin
  if (role === 'admin') {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalStaff = await Staff.countDocuments();
    const productsSold = await Payment.countDocuments({ status: 'completed' });
    const pendingTests = await Product.countDocuments({ qualityStatus: 'pending' });

    const revenueAgg = await Payment.aggregate([
      { ₹match: { status: 'completed' } },
      { ₹group: { _id: null, total: { ₹sum: "₹amount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Notifications for admin
    const duePayments = await Payment.find({ status: 'pending' }).populate('user', 'name email');
    const pestAlerts = await Product.find({ pestInfo: { ₹exists: true, ₹ne: "" } }).select('name pestInfo');

    return res.json({
      role: 'admin',
      stats: { users: totalUsers, staff: totalStaff, productsSold, pendingTests, revenue: totalRevenue },
      quickActions: [
        { name: "Add User", action: "/api/users" },
        { name: "Add Staff", action: "/api/staff" },
        { name: "Add Product", action: "/api/products" },
        { name: "Generate Report", action: "/api/reports/custom" }
      ],
      notifications: {
        paymentDue: duePayments.map(p => ({ user: p.user?.name, amount: p.amount, date: p.date })),
        pendingTests,
        pestAlerts
      },
      timeline
    });
  }

  // Role: Staff
  if (role === 'staff') {
    const assignedUsers = await User.countDocuments({ assignedStaff: req.user._id });
    const assignedProducts = await Product.countDocuments({ assignedStaff: req.user._id });
    const pendingTests = await Product.countDocuments({ assignedStaff: req.user._id, qualityStatus: 'pending' });

    // Notifications for staff: tasks assigned
    const tasks = await Notification.find({ type: 'task', 'meta.staff': req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      role: 'staff',
      stats: { assignedUsers, assignedProducts, pendingTests },
      quickActions: [
        { name: "Update Quality Test", action: "/api/products/:id/test" },
        { name: "View User Details", action: "/api/users/:id" },
        { name: "Mark Task Completed", action: "/api/staff/:id/tasks" }
      ],
      notifications: {
        tasks
      },
      timeline
    });
  }

  // Role: User
  if (role === 'user') {
    const user = await User.findById(req.user._id).populate('assignedStaff', 'name email');
    const payments = await Payment.find({ user: req.user._id, status: 'completed' }).select('amount date');

    // Notifications for user: pest alerts on their products
    const pestAlerts = await Product.find({ _id: { ₹in: user.purchases }, pestInfo: { ₹exists: true, ₹ne: "" } })
      .select('name pestInfo');

    return res.json({
      role: 'user',
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        staffAssigned: user.assignedStaff
      },
      purchases: user.purchases,
      payments,
      quickActions: [
        { name: "Edit Profile", action: "/api/users/me" },
        { name: "Raise Support Ticket", action: "/api/support" }
      ],
      notifications: {
        pestAlerts
      },
      timeline
    });
  }

  res.status(403).json({ message: 'Role not supported' });
});

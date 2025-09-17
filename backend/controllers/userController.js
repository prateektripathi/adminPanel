const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Staff = require('../models/staff');

// List users (admin or staff sees assigned)
exports.list = asyncHandler(async (req, res) => {
  const q = {};
  if (req.user.role === 'staff') q.assignedStaff = req.user._id;
  // add filters from req.query (paymentStatus, product etc.)
  const users = await User.find(q).populate('assignedStaff','name email');
  res.json(users);
});

exports.get = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('assignedStaff','name');
  if(!user) return res.status(404).json({message:'Not found'});
  res.json(user);
});

exports.create = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  const userExists = await User.findOne({ email });
  if(userExists) return res.status(400).json({message:'Email exists'});
  const user = await User.create({ name, email, password, phone, address, role });
  res.status(201).json(user);
});

exports.update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(!user) return res.status(404).json({message:'Not found'});
  const allowedFields = ['name','phone','address','assignedStaff','paymentStatus'];
  allowedFields.forEach(f => { if(req.body[f] !== undefined) user[f]=req.body[f]; });
  await user.save();
  res.json(user);
});

exports.remove = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

// Bulk upload (CSV)
exports.bulkUpload = asyncHandler(async (req, res) => {
  // expect CSV in req.file (multer)
  const { parseCsv } = require('../utils/csvParser');
  const rows = await parseCsv(req.file.path);
  const created = [];
  for (const row of rows) {
    const u = await User.create({
      name: row.name,
      email: row.email,
      password: row.password || 'changeme',
      phone: row.phone,
      address: row.address
    }).catch(()=>null);
    if(u) created.push(u);
  }
  res.json({ created: created.length });
});

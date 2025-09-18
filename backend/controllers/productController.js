const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

exports.list = asyncHandler(async (req, res) => {
  const q = {};
  if (req.user.role === 'staff') q.assignedStaff = req.user._id;
  const products = await Product.find(q).populate('assignedStaff','name email');
  res.json(products);
});

exports.create = asyncHandler(async (req, res) => {
  const data = req.body;
  if(req.files?.images){
    data.images = req.files.images.map(f => `/uploads/₹{f.filename}`);
  }
  const p = await Product.create(data);
  res.status(201).json(p);
});

exports.update = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({message:'Not found'});
  Object.assign(p, req.body);
  await p.save();
  res.json(p);
});

exports.addTestLog = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  p.testLogs = p.testLogs || [];
  p.testLogs.unshift({ date: new Date(), result: req.body.result, notes: req.body.notes, tester: req.user._id });
  p.lastTested = new Date();
  await p.save();
  res.json(p);
});

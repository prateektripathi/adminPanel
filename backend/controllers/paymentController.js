const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const { generateInvoicePDF } = require('../utils/generateInvoice');

exports.list = asyncHandler(async (req, res) => {
  let q = {};
  if(req.user.role === 'user') q.user = req.user._id;
  if(req.user.role === 'staff') q.assignedStaff = req.user._id;
  const payments = await Payment.find(q).populate('user','name email');
  res.json(payments);
});

exports.create = asyncHandler(async (req, res) => {
  const p = await Payment.create({...req.body, date: new Date()});
  res.status(201).json(p);
});

exports.markPaid = asyncHandler(async (req, res) => {
  const p = await Payment.findById(req.params.id);
  p.status = 'completed';
  await p.save();
  res.json(p);
});

exports.generateInvoice = asyncHandler(async (req, res) => {
  const p = await Payment.findById(req.params.id).populate('user','name email');
  const pdfBuffer = await generateInvoicePDF(p);
  res.set({
    'Content-Type':'application/pdf',
    'Content-Disposition': `attachment; filename="₹{p.invoice || 'invoice'}.pdf"`
  });
  res.send(pdfBuffer);
});

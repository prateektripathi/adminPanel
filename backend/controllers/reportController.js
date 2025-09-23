const asyncHandler = require('express-async-handler');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const User = require('../models/User');
const Staff = require('../models/Staff');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

// Standard reports (Admin only)
const getReports = asyncHandler(async (req, res) => {
  const sales = await Payment.countDocuments({ status: 'completed' });

  const revenueAgg = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

  const topProducts = await Product.aggregate([
    { $group: { _id: "$name", sold: { $sum: 1 } } },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  const staffPerformance = await Staff.aggregate([
    { $project: { name: 1, assignedUsers: 1, count: { $size: "$assignedUsers" } } },
    { $sort: { count: -1 } },
  ]);

  res.json({ sales, revenue, topProducts, staffPerformance });
});

// Custom report builder (Admin only)
const customReport = asyncHandler(async (req, res) => {
  const { type, filters, format } = req.body;

  let data = [];

  switch (type) {
    case 'users':
      data = await User.find(filters || {}).select('-password');
      break;
    case 'staff':
      data = await Staff.find(filters || {}).populate('assignedUsers', 'name email');
      break;
    case 'products':
      data = await Product.find(filters || {}).populate('assignedStaff', 'name email');
      break;
    case 'payments':
      data = await Payment.find(filters || {}).populate('user', 'name email');
      break;
    default:
      return res.status(400).json({ message: 'Invalid report type' });
  }

  // Export formats
  if (format === 'csv') {
    const parser = new Parser();
    const csv = parser.parse(data.map(d => d.toObject()));
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}-report.csv`);
    return res.send(csv);
  }

  if (format === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${type} Report`);

    if (data.length > 0) {
      sheet.columns = Object.keys(data[0].toObject()).map(key => ({
        header: key,
        key: key,
        width: 20,
      }));
      data.forEach(d => sheet.addRow(d.toObject()));
    }

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment(`${type}-report.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  }

  if (format === 'pdf') {
    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment(`${type}-report.pdf`);

    doc.pipe(res);
    doc.fontSize(16).text(`${type.toUpperCase()} REPORT`, { align: 'center' });
    doc.moveDown();

    data.forEach(d => {
      doc.fontSize(10).text(JSON.stringify(d.toObject()), { align: 'left' });
      doc.moveDown();
    });

    doc.end();
    return;
  }

  // Default JSON
  res.json({ type, count: data.length, data });
});

module.exports = {
  getReports,
  customReport,
};

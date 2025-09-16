const User = require('../models/User');
const csvParser = require('csv-parser');
const fs = require('fs');
const excel = require('excel4node');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Staff)
const getUsers = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = User.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate fields
    query = query.populate('assignedStaff', 'name email phone role');

    const users = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('assignedStaff', 'name email phone role')
      .populate('purchases.product', 'name price category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Assign staff to user
// @route   POST /api/users/:id/assign-staff
// @access  Private (Admin)
const assignStaff = async (req, res) => {
  try {
    const { staffIds } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify staff members exist and have staff role
    const staff = await User.find({
      _id: { $in: staffIds },
      role: 'staff',
      isActive: true
    });

    if (staff.length !== staffIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some staff members not found or inactive'
      });
    }

    user.assignedStaff = staffIds;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Bulk upload users
// @route   POST /api/users/bulk-upload
// @access  Private (Admin)
const bulkUploadUsers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const users = [];
    const filePath = req.file.path;

    // Parse CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        users.push({
          name: row.name,
          email: row.email,
          phone: row.phone,
          password: row.password || 'defaultpass123',
          role: row.role || 'user',
          address: {
            street: row.street,
            city: row.city,
            state: row.state,
            zipCode: row.zipCode
          }
        });
      })
      .on('end', async () => {
        try {
          const createdUsers = await User.insertMany(users, { ordered: false });
          
          // Clean up uploaded file
          fs.unlinkSync(filePath);

          res.status(201).json({
            success: true,
            message: `${createdUsers.length} users created successfully`,
            data: createdUsers
          });
        } catch (bulkError) {
          fs.unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: 'Error creating users',
            error: bulkError.message
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Export users
// @route   GET /api/users/export
// @access  Private (Admin)
const exportUsers = async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    const users = await User.find({}).select('-password');

    if (format === 'excel') {
      // Create Excel workbook
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Add headers
      const headers = ['Name', 'Email', 'Phone', 'Role', 'Payment Status', 'Created At'];
      headers.forEach((header, index) => {
        worksheet.cell(1, index + 1).string(header);
      });

      // Add data
      users.forEach((user, index) => {
        worksheet.cell(index + 2, 1).string(user.name);
        worksheet.cell(index + 2, 2).string(user.email);
        worksheet.cell(index + 2, 3).string(user.phone);
        worksheet.cell(index + 2, 4).string(user.role);
        worksheet.cell(index + 2, 5).string(user.paymentStatus);
        worksheet.cell(index + 2, 6).string(user.createdAt.toISOString());
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
      
      workbook.write(res);
    } else {
      // CSV format
      const csvData = users.map(user => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        paymentStatus: user.paymentStatus,
        createdAt: user.createdAt
      }));

      const csv = convertToCSV(csvData);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
      res.send(csv);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin/Staff)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const paidUsers = await User.countDocuments({ role: 'user', paymentStatus: 'paid' });
    const pendingPayments = await User.countDocuments({ role: 'user', paymentStatus: 'pending' });

    const stats = {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      paid: paidUsers,
      pendingPayments,
      overduePayments: await User.countDocuments({ role: 'user', paymentStatus: 'overdue' })
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update user profile (for users themselves)
// @route   PUT /api/users/profile/me
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      profile: req.body.profile
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Utility function to convert JSON to CSV
const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  assignStaff,
  bulkUploadUsers,
  exportUsers,
  getUserStats,
  updateUserProfile
};
const Staff = require('../models/staff'); // Just require, no mongoose.model() here

// Get all staff
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new staff
const createStaff = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newStaff = new Staff({ name, email, role });
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update staff
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign users to staff
const assignUsers = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const { userIds } = req.body; // array of user IDs
    staff.assignedUsers = userIds;
    await staff.save();

    res.json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get task history (placeholder)
const getTaskHistory = async (req, res) => {
  try {
    res.json({ message: 'Task history not implemented yet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  assignUsers,
  getTaskHistory
};

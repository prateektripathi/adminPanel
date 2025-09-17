const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: String,
  email: {type:String, unique:true},
  role: String,
  availability: String,
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completedTasks: Number,
  pendingTasks: Number,
  performance: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);

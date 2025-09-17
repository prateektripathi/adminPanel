const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  role: { type: String, enum: ['admin','staff','user'], default: 'user' },
  avatar: String,
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  purchases: [{ type: String }],
  paymentStatus: { type: String, enum: ['paid','pending','overdue'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function(candidate){
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);

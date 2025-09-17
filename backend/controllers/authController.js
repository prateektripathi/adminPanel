const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if(!ok) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, token: signToken(user) });
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if(exists) return res.status(400).json({ message: 'User exists' });
  const user = await User.create({ name, email, password, role: role || 'user' });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: signToken(user) });
});

exports.me = asyncHandler(async (req, res) => {
  const u = req.user;
  res.json({ user: u });
});

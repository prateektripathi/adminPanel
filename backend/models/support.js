// models/SupportModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'audio', 'file'] },
  url: { type: String }, // URL for the stored media
  fileName: { type: String }, // Original file name for attachments
  timestamp: { type: Date, default: Date.now },
});

const supportQuerySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }, // Initial message from the user
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending',
  },
  timestamp: { type: Date, default: Date.now },
  unreadCount: { type: Number, default: 0 },
  lastMessage: { type: String }, // Summary of the last message for quick view
  chatMessages: [messageSchema], // Array of chat messages
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('SupportQuery', supportQuerySchema);
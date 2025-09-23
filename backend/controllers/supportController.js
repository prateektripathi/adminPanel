// controllers/SupportController.js
const SupportQuery = require('../models/support');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Files will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// --- Controller Functions ---

// @desc    Create a new support query
// @route   POST /api/support/queries
// @access  Public (or could be authenticated user)
exports.createSupportQuery = async (req, res) => {
  try {
    const { userName, userEmail, subject, message, priority } = req.body;

    // Create initial chat messages
    const initialChatMessages = [
      { sender: 'user', text: message, timestamp: new Date(), userName },
      { sender: 'admin', text: `Hi ${userName}, I've received your query about ${subject}. How can I help you today?`, timestamp: new Date() }
    ];

    const newQuery = await SupportQuery.create({
      userName,
      userEmail,
      subject,
      message, // Store initial message
      priority: priority || 'medium',
      status: 'pending',
      unreadCount: 0, // Admin creates, so 0 for admin view
      lastMessage: message,
      chatMessages: initialChatMessages,
    });
    res.status(201).json(newQuery);
  } catch (error) {
    console.error('Error creating support query:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all support queries
// @route   GET /api/support/queries
// @access  Private (Admin)
exports.getAllSupportQueries = async (req, res) => {
  try {
    const queries = await SupportQuery.find().sort({ timestamp: -1 });
    res.status(200).json(queries);
  } catch (error) {
    console.error('Error fetching support queries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single support query by ID
// @route   GET /api/support/queries/:id
// @access  Private (Admin)
exports.getSupportQueryById = async (req, res) => {
  try {
    const query = await SupportQuery.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Support query not found' });
    }
    res.status(200).json(query);
  } catch (error) {
    console.error('Error fetching support query by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update support query status
// @route   PUT /api/support/queries/:id/status
// @access  Private (Admin)
exports.updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const query = await SupportQuery.findById(req.params.id);

    if (!query) {
      return res.status(404).json({ message: 'Support query not found' });
    }

    query.status = status;
    await query.save();
    res.status(200).json(query);
  } catch (error) {
    console.error('Error updating query status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a new message to a support query's chat
// @route   POST /api/support/queries/:id/messages
// @access  Private (Admin)
exports.addChatMessage = async (req, res) => {
  try {
    const { sender, text } = req.body; // Sender should be 'admin' or 'user'
    const queryId = req.params.id;

    const query = await SupportQuery.findById(queryId);

    if (!query) {
      return res.status(404).json({ message: 'Support query not found' });
    }

    const newMessage = {
      sender,
      text,
      timestamp: new Date(),
    };

    query.chatMessages.push(newMessage);
    query.lastMessage = text; // Update last message summary
    if (sender === 'user') {
        query.unreadCount += 1; // Increment unread for admin if user sends message
    } else {
        query.unreadCount = 0; // Admin sending means they've seen latest
    }

    await query.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding chat message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload a file and add it as a message
// @route   POST /api/support/queries/:id/upload
// @access  Private (Admin)
exports.uploadFileAndAddMessage = async (req, res) => {
  try {
    const queryId = req.params.id;
    const { sender } = req.body; // 'admin' or 'user'

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const query = await SupportQuery.findById(queryId);

    if (!query) {
      // If query not found, delete the uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting orphaned file:', err);
      });
      return res.status(404).json({ message: 'Support query not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // URL accessible from frontend
    const mediaType = req.file.mimetype.startsWith('image') ? 'image' :
                      req.file.mimetype.startsWith('video') ? 'video' :
                      req.file.mimetype.startsWith('audio') ? 'audio' : 'file';

    const newMessage = {
      sender: sender || 'admin', // Default to admin if not specified
      mediaType,
      url: fileUrl,
      fileName: req.file.originalname,
      timestamp: new Date(),
    };

    query.chatMessages.push(newMessage);
    query.lastMessage = `[${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}] ${req.file.originalname}`;
    if (sender === 'user') {
        query.unreadCount += 1;
    } else {
        query.unreadCount = 0;
    }

    await query.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error uploading file and adding message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the multer upload middleware
exports.uploadMiddleware = upload;

// @desc    Mark unread messages as read for a query
// @route   PUT /api/support/queries/:id/mark-read
// @access  Private (Admin)
exports.markQueryAsRead = async (req, res) => {
    try {
        const queryId = req.params.id;
        const query = await SupportQuery.findById(queryId);

        if (!query) {
            return res.status(404).json({ message: 'Support query not found' });
        }

        query.unreadCount = 0; // Mark all as read
        await query.save();
        res.status(200).json({ message: 'Query marked as read', query });
    } catch (error) {
        console.error('Error marking query as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Simulate user response after admin message
// @route   POST /api/support/queries/:id/simulate-user-response
// @access  Private (Internal use or triggered by admin action)
exports.simulateUserResponse = async (req, res) => {
    try {
        const queryId = req.params.id;
        const query = await SupportQuery.findById(queryId);

        if (!query) {
            return res.status(404).json({ message: 'Support query not found' });
        }

        const simulatedMessage = {
            sender: 'user',
            text: "Thank you for your response! This is helpful.",
            timestamp: new Date(),
            userName: query.userName // Use the query's user name
        };

        query.chatMessages.push(simulatedMessage);
        query.lastMessage = simulatedMessage.text;
        query.unreadCount += 1; // Increment unread count for the admin

        await query.save();
        res.status(200).json(simulatedMessage);
    } catch (error) {
        console.error('Error simulating user response:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// routes/SupportRoutes.js
const express = require('express');
const {
  createSupportQuery,
  getAllSupportQueries,
  getSupportQueryById,
  updateQueryStatus,
  addChatMessage,
  uploadFileAndAddMessage,
  uploadMiddleware, // Import the multer middleware
  markQueryAsRead,
  simulateUserResponse
} = require('../controllers/supportController');

const router = express.Router();

// Public route for users to submit a new query (e.g., from a contact form)
router.post('/queries', createSupportQuery);

// Admin routes (would typically be protected with authentication middleware)
router.get('/queries', getAllSupportQueries);
router.get('/queries/:id', getSupportQueryById);
router.put('/queries/:id/status', updateQueryStatus);
router.put('/queries/:id/mark-read', markQueryAsRead); // New route to mark as read

router.post('/queries/:id/messages', addChatMessage);
router.post('/queries/:id/upload', uploadMiddleware.single('file'), uploadFileAndAddMessage); // Use multer middleware here

// Route for simulating user response (optional, can be triggered by admin action)
router.post('/queries/:id/simulate-user-response', simulateUserResponse);


module.exports = router;
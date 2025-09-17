require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use(
  '/uploads',
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads'))
);

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/products', require('./routes/products'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/buckets', require('./routes/buckets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications'));

// Error handler (must be after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ MongoDB connected`);
  console.log(`🚀 Server running on port ${PORT}`);
});

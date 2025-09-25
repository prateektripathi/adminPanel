// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const mongoose = require('mongoose'); // Mongoose required for connection
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// // ================== Middleware ==================
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static uploads folder
// app.use(
//   '/uploads',
//   express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads'))
// );

// // ================== Database ==================
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
//   } catch (error) {
//     console.error(`❌ MongoDB connection error: ${error}`);
//     process.exit(1);
//   }
// };

// connectDB();

// // ================== Routes ==================
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/staff', require('./routes/staff'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/buckets', require('./routes/buckets'));
// app.use('/api/reports', require('./routes/reports'));
// app.use('/api/dashboard', require('./routes/dashboard'));
// app.use('/api/notifications', require('./routes/notifications'));

// // ================== Error Handler ==================
// app.use(errorHandler);

// // ================== Start Server ==================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
// });


// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ================== Middleware ==================

// Read allowed origins from .env (comma separated)
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // allow cookies / auth headers if needed
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== Static Files ==================
app.use(
  '/uploads',
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads'))
);

// ================== Database ==================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

connectDB();

// ================== Routes ==================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/products', require('./routes/products'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/buckets', require('./routes/buckets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/support', require('./routes/support')); // customer support routes

// ================== Error Handler ==================
app.use(errorHandler);

// ================== Start Server ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

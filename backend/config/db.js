const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ₹{conn.connection.host}/₹{conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ₹{error.message}`);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;

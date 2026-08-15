const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolioDB";
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

module.exports = connectDB;

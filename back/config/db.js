const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://portfolioDB:my123@library.9hq0pbi.mongodb.net/library?appName=library";
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      bufferCommands: false
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ Connected to MongoDB successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

module.exports = connectDB;

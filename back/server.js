require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const cvRoutes = require("./routes/cvRoutes");
const profileRoutes = require("./routes/profileRoutes");
const videoRoutes = require("./routes/videoRoutes");

const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "150mb" })); // Increase limit to 150mb for larger video uploads
app.use(express.urlencoded({ limit: "150mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Base Route
app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/videos", videoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

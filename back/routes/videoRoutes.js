const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadToCloudinary } = require("../config/uploadHelper");

// GET: All videos (Public)
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a new video (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };

    // Upload video to Cloudinary if base64
    if (data.videoUrl && data.videoUrl.startsWith("data:")) {
      data.videoUrl = await uploadToCloudinary(data.videoUrl, "portfolio/videos", "video");
    }
    // Upload thumbnail to Cloudinary if base64
    if (data.thumbnailUrl && data.thumbnailUrl.startsWith("data:")) {
      data.thumbnailUrl = await uploadToCloudinary(data.thumbnailUrl, "portfolio/thumbnails", "image");
    }

    const newVideo = new Video(data);
    const saved = await newVideo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a video (Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };

    // Upload video to Cloudinary if base64
    if (data.videoUrl && data.videoUrl.startsWith("data:")) {
      data.videoUrl = await uploadToCloudinary(data.videoUrl, "portfolio/videos", "video");
    }
    // Upload thumbnail to Cloudinary if base64
    if (data.thumbnailUrl && data.thumbnailUrl.startsWith("data:")) {
      data.thumbnailUrl = await uploadToCloudinary(data.thumbnailUrl, "portfolio/thumbnails", "image");
    }

    const updated = await Video.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "Video not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete a video (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

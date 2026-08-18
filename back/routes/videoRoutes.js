const express = require("express");
const router = express.Router();
const Video = require("../models/Video");
const { authMiddleware } = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

// Helper to save base64 to file
function saveBase64File(base64Data, folder) {
  if (!base64Data || !base64Data.startsWith("data:")) return base64Data;
  
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Data;
  
  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  
  let ext = mimeType.split("/")[1];
  if (ext === "quicktime") ext = "mov";
  if (ext && ext.includes(";")) ext = ext.split(";")[0];
  
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const dirPath = path.join(__dirname, "..", folder);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, filename);
  fs.writeFileSync(filePath, buffer);
  
  return `/${folder}/${filename}`;
}

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
    if (data.videoUrl && data.videoUrl.startsWith("data:")) {
      data.videoUrl = saveBase64File(data.videoUrl, "uploads");
    }
    if (data.thumbnailUrl && data.thumbnailUrl.startsWith("data:")) {
      data.thumbnailUrl = saveBase64File(data.thumbnailUrl, "uploads");
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
    if (data.videoUrl && data.videoUrl.startsWith("data:")) {
      data.videoUrl = saveBase64File(data.videoUrl, "uploads");
    }
    if (data.thumbnailUrl && data.thumbnailUrl.startsWith("data:")) {
      data.thumbnailUrl = saveBase64File(data.thumbnailUrl, "uploads");
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

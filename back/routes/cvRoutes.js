const express = require("express");
const router = express.Router();
const Cv = require("../models/Cv");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadToCloudinary } = require("../config/uploadHelper");

// GET: Fetch the current CV (Public)
router.get("/", async (req, res) => {
  try {
    const cv = await Cv.findOne().sort({ uploadedAt: -1 });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Upload/replace CV (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };

    // Upload CV PDF to Cloudinary if base64
    if (data.fileUrl && data.fileUrl.startsWith("data:")) {
      data.fileUrl = await uploadToCloudinary(data.fileUrl, "portfolio/cv", "image");
    }

    // Delete all previous CVs (keep only the latest)
    await Cv.deleteMany({});
    const newCv = new Cv(data);
    const saved = await newCv.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete CV (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Cv.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "CV not found" });
    }
    res.json({ message: "CV deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

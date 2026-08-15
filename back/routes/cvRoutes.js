const express = require("express");
const router = express.Router();
const Cv = require("../models/Cv");

// GET: Fetch the current CV
router.get("/", async (req, res) => {
  try {
    const cv = await Cv.findOne().sort({ uploadedAt: -1 });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Upload/replace CV
router.post("/", async (req, res) => {
  try {
    // Delete all previous CVs (keep only the latest)
    await Cv.deleteMany({});
    const newCv = new Cv(req.body);
    const saved = await newCv.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete CV
router.delete("/:id", async (req, res) => {
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

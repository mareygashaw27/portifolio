const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const { authMiddleware } = require("../middleware/authMiddleware");

// GET: Fetch all certificates (Public)
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a new certificate (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newCertificate = new Certificate(req.body);
    const saved = await newCertificate.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a certificate by ID (Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete a certificate by ID (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json({ message: "Certificate deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

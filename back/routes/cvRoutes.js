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

// GET: Stream CV PDF file directly with CORS & inline headers
router.get("/file", async (req, res) => {
  try {
    const cv = await Cv.findOne().sort({ uploadedAt: -1 });
    if (!cv || !cv.fileUrl) {
      return res.status(404).send("CV not found");
    }

    // Handle base64 Data URIs directly
    if (cv.fileUrl.startsWith("data:")) {
      const parts = cv.fileUrl.split(";base64,");
      const contentType = parts[0].replace("data:", "") || "application/pdf";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", "inline; filename=\"cv.pdf\"");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.send(buffer);
    }

    let secureUrl = cv.fileUrl.startsWith("http://") ? cv.fileUrl.replace("http://", "https://") : cv.fileUrl;
    if (secureUrl.includes("cloudinary.com") && !secureUrl.includes("/fl_inline/")) {
      secureUrl = secureUrl.includes("/raw/upload/")
        ? secureUrl.replace("/raw/upload/", "/image/upload/fl_inline/")
        : secureUrl.replace("/image/upload/", "/image/upload/fl_inline/");
    }

    try {
      const response = await fetch(secureUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (response.ok) {
        const contentType = response.headers.get("content-type") || "application/pdf";
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", "inline; filename=\"cv.pdf\"");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(buffer);
      }
    } catch (e) {
      console.warn("Fetch failed, redirecting to secureUrl:", e.message);
    }

    // Fallback: Redirect directly to secureUrl
    return res.redirect(secureUrl);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST: Upload/replace CV (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };

    // Upload CV PDF to Cloudinary if base64
    if (data.fileUrl && data.fileUrl.startsWith("data:")) {
      // Cloudinary treats PDFs best when uploaded as 'image' or 'auto' (this preserves the .pdf extension and application/pdf mime type)
      const resourceType = "auto";
      data.fileUrl = await uploadToCloudinary(data.fileUrl, "portfolio/cv", resourceType);
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

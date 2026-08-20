const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadToCloudinary } = require("../config/uploadHelper");

// GET /api/profile - Get profile (public)
router.get("/", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create default profile if none exists
      profile = await Profile.create({
        name: "Marey Gashaw",
        title: "Full-Stack Web Developer",
        subtitle: "Information Technology Student",
        description: "Passionate about building modern web applications and exploring new technologies. Turning ideas into digital experiences.",
        email: "mareygashaw21@gmail.com",
        phone: "0943454397",
        photoUrl: ""
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/profile - Update profile (protected)
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, title, subtitle, description, email, phone, photoUrl } = req.body;
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({});
    }
    if (name !== undefined) profile.name = name;
    if (title !== undefined) profile.title = title;
    if (subtitle !== undefined) profile.subtitle = subtitle;
    if (description !== undefined) profile.description = description;
    if (email !== undefined) profile.email = email;
    if (phone !== undefined) profile.phone = phone;

    // Upload profile photo to Cloudinary if base64
    if (photoUrl !== undefined) {
      if (photoUrl && photoUrl.startsWith("data:")) {
        profile.photoUrl = await uploadToCloudinary(photoUrl, "portfolio/profile", "image");
      } else {
        profile.photoUrl = photoUrl;
      }
    }

    profile.updatedAt = new Date();
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

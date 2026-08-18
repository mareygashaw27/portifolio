const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  tool: { type: String, default: "CapCut" },      // e.g. CapCut, Premiere Pro
  videoUrl: { type: String, required: true },      // YouTube / TikTok / direct link
  thumbnailUrl: { type: String, default: "" },     // optional thumbnail image (base64 or URL)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", VideoSchema);

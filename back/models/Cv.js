const mongoose = require("mongoose");

const CvSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: "" },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cv", CvSchema);

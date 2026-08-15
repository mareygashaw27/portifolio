const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: "" },
  description: { type: String, default: "" },
  icon: { type: String, default: "📜" },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Certificate", CertificateSchema);

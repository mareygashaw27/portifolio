const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: String, default: "React, Node.js" },
  imageUrl: { type: String, default: "" },
  projectUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);

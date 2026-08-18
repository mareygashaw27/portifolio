const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: "Marey Gashaw" },
  title: { type: String, default: "Full-Stack Web Developer" },
  subtitle: { type: String, default: "Information Technology Student" },
  description: { type: String, default: "Passionate about building modern web applications and exploring new technologies. Turning ideas into digital experiences." },
  email: { type: String, default: "mareygashaw21@gmail.com" },
  phone: { type: String, default: "0943454397" },
  photoUrl: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", ProfileSchema);

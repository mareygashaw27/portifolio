const express = require("express");
const router = express.Router();
const { authMiddleware, generateToken, verifyToken } = require("../middleware/authMiddleware");

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME || "mar";
  const validPassword = process.env.ADMIN_PASSWORD || "4225";

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Please enter both username and password!" 
    });
  }

  if (username.trim() === validUsername && String(password).trim() === validPassword) {
    const token = generateToken({ username: validUsername, role: "admin" });
    return res.json({
      success: true,
      message: "Welcome back! Login successful.",
      token,
      user: { username: validUsername, role: "admin" }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password! Please try again."
  });
});

// GET /api/auth/verify
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  const adminUser = process.env.ADMIN_USERNAME || "mar";
  if (payload && payload.username === adminUser) {
    return res.json({ authenticated: true, user: payload });
  }

  return res.status(401).json({ authenticated: false });
});

module.exports = router;

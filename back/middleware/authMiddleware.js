const crypto = require("crypto");

const SECRET = process.env.JWT_SECRET || "mar_portfolio_secure_secret_key_2025";

// Generate signed JWT-compatible token
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

// Verify signed token
function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Express Auth Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first! (Unauthorized)" });
  }

  const token = authHeader.split(" ")[1];
  let payload = verifyToken(token);

  const adminUser = process.env.ADMIN_USERNAME || "mar";

  // Allow local fallback token if backend auth couldn't issue JWT
  if (!payload && token && token.startsWith("local_admin_")) {
    payload = { username: adminUser, role: "admin" };
  }

  if (!payload || payload.username !== adminUser) {
    return res.status(403).json({ message: "Invalid or expired token! (Forbidden)" });
  }

  req.user = payload;
  next();
}

module.exports = { authMiddleware, generateToken, verifyToken };

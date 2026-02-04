// src/middleware/auth.js

const jwt = require("jsonwebtoken");

/* ============================================================
   AUTHENTICATE ANY LOGGED-IN USER
============================================================ */

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({
      success: false,
      message: "Authentication configuration error",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

/* ============================================================
   AUTHENTICATE PLATFORM ADMIN
============================================================ */

function authenticatePlatform(req, res, next) {
  authenticateUser(req, res, () => {
    if (!req.user || req.user.userType !== "PLATFORM") {
      return res.status(403).json({
        success: false,
        message: "Platform access required",
      });
    }
    next();
  });
}

/* ============================================================
   AUTHENTICATE CHURCH AUTHORITY
============================================================ */

function authenticateChurchAuthority(req, res, next) {
  authenticateUser(req, res, () => {
    if (!req.user || req.user.userType !== "CHURCH_AUTHORITY") {
      return res.status(403).json({
        success: false,
        message: "Church authority access required",
      });
    }
    next();
  });
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  authenticateUser,
  authenticatePlatform,
  authenticateChurchAuthority,
};

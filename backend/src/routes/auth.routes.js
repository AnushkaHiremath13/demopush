const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/auth.controller");

// ✅ IMPORTANT: destructure the middleware
const { authenticateUser } = require("../middleware/auth");

/* ================= AUTH ROUTES ================= */

router.post("/register", register);
router.post("/login", login);

// 🔐 Logout (protected)
router.post("/logout", authenticateUser, logout);

module.exports = router;

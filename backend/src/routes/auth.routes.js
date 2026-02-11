// src/routes/auth.routes.js

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/AuthController");
/* ============================================================
   AUTH ROUTES
============================================================ */

// Community user registration
router.post("/register", register);

// Login (community user or platform admin)
router.post("/login", login);

// Stateless logout (client deletes token)(stateless)
router.post("/logout", logout);

module.exports = router;

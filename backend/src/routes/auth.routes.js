// src/routes/auth.routes.js

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/auth.controller");

const { authenticateUser } = require("../middleware/auth");

/* ============================================================
   AUTH ROUTES
============================================================ */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);

module.exports = router;

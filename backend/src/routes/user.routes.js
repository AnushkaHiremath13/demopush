// src/routes/user.routes.js

const express = require("express");
const router = express.Router();

const { requireCommunity } = require("../middleware/auth");
const { getMe } = require("../controllers/UserController");

/* ============================================================
   USER PROFILE (COMMUNITY ONLY)
============================================================ */

router.get(
  "/me",
  requireCommunity,
  getMe
);

module.exports = router;

// src/routes/church.routes.js (example)

const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/auth");

const {
  pending,
  approve,
  reject,
} = require("../controllers/ChurchFollowerController");

const {
  createChurchApplicant,
} = require("../controllers/ChurchApplicantController");

// ✅ PUBLIC – NO AUTH
router.post("/apply", createChurchApplicant);

// /* ============================================================
//    FOLLOWER APPROVAL ROUTES (CHURCH AUTHORITY)
// ============================================================ */

// router.get(
//   "/followers/pending",
//   authenticateUser,
//   pending
// );

// router.patch(
//   "/followers/:uid/approve",
//   authenticateUser,
//   approve
// );

// router.patch(
//   "/followers/:uid/reject",
//   authenticateUser,
//   reject
// );

// module.exports = router;
//commented out follower approval routes for now which is not necesssary for the plat

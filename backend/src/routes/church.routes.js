const express = require("express");
const router = express.Router();

const { requireCommunity } = require("../middleware/auth");

const {
  pending,
  approve,
  reject,
} = require("../controllers/ChurchFollowerController");

const {
  createChurchApplicant,
} = require("../controllers/ChurchApplicantController");

/* ============================================================
   PUBLIC – CHURCH APPLICATION
============================================================ */

router.post("/apply", createChurchApplicant);

/* ============================================================
   FOLLOWER APPROVAL ROUTES (CHURCH ADMIN)
   Scope: COMMUNITY
   Church is resolved from logged-in user
============================================================ */

router.get(
  "/followers/pending",
  requireCommunity,
  pending
);

router.patch(
  "/followers/:userId/approve",
  requireCommunity,
  approve
);

router.patch(
  "/followers/:userId/reject",
  requireCommunity,
  reject
);

module.exports = router;

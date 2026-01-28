const express = require("express");
const router = express.Router();

const { authenticatePlatform } = require("../middleware/auth");

/* ================= DASHBOARD ================= */
const { getDashboardStats } = require("../controllers/DashboardController");

/* ================= SECURITY LOGS ================= */
const { getSecurityLogs } = require("../controllers/SecurityLogController");

/* ================= CHURCH APPLICANTS (PRE-APPROVAL) ================= */
const {
  getChurchApplicants,
  getChurchApplicantById,
  createChurchApplicant,
  approveChurchApplicant,
  rejectChurchApplicant,
} = require("../controllers/ChurchApplicantController");

/* CREATE CHURCH APPLICATION */
router.post(
  "/church-applicants",
  authenticatePlatform,
  createChurchApplicant
);

/* GET ALL PENDING APPLICATIONS */
router.get(
  "/church-applicants",
  authenticatePlatform,
  getChurchApplicants
);

/* GET SINGLE APPLICATION */
router.get(
  "/church-applicants/:applicationId",
  authenticatePlatform,
  getChurchApplicantById
);

/* APPROVE APPLICATION */
router.post(
  "/church-applicants/:applicationId/approve",
  authenticatePlatform,
  approveChurchApplicant
);

/* REJECT APPLICATION */
router.post(
  "/church-applicants/:applicationId/reject",
  authenticatePlatform,
  rejectChurchApplicant
);

/* ================= CHURCHES (POST-APPROVAL) ================= */
const {
  getAllChurches,
  assignAuthority,
  suspend,
  activate,
  getChurchById,
} = require("../controllers/PlatformChurchController");

/* GET ALL APPROVED & ACTIVE CHURCHES */
router.get(
  "/church/all",
  authenticatePlatform,
  getAllChurches
);

/* GET SINGLE CHURCH BY ID ✅ (USED BY ApprovedChurchDetails) */
router.get(
  "/church/:churchId",
  authenticatePlatform,
  getChurchById
);

/* ASSIGN CHURCH AUTHORITY */
router.post(
  "/church/:cid/assign-authority",
  authenticatePlatform,
  assignAuthority
);

/* SUSPEND CHURCH */
router.post(
  "/church/:cid/suspend",
  authenticatePlatform,
  suspend
);

/* ACTIVATE CHURCH */
router.post(
  "/church/:cid/activate",
  authenticatePlatform,
  activate
);

/* ================= PLATFORM USERS ================= */
const {
  getUsers,
  block,
  unblock,
} = require("../controllers/PlatformUserController");

/* GET USERS */
router.get(
  "/users",
  authenticatePlatform,
  getUsers
);

/* BLOCK USER */
router.post(
  "/user/:uid/block",
  authenticatePlatform,
  block
);

/* UNBLOCK USER */
router.post(
  "/user/:uid/unblock",
  authenticatePlatform,
  unblock
);

/* ================= DASHBOARD ================= */
router.get(
  "/dashboard",
  authenticatePlatform,
  getDashboardStats
);

/* ================= SECURITY LOGS ================= */
router.get(
  "/security-logs",
  authenticatePlatform,
  getSecurityLogs
);

module.exports = router;

const express = require("express");
const router = express.Router();

const { requirePlatform } = require("../middleware/auth");

/* ============================================================
   DASHBOARD
============================================================ */

const { getDashboardStats } = require("../controllers/DashboardController");

router.get(
  "/dashboard",
  requirePlatform,
  getDashboardStats
);

/* ============================================================
   SECURITY LOGS
============================================================ */

const { getSecurityLogs } = require("../controllers/SecurityLogController");

router.get(
  "/security-logs",
  requirePlatform,
  getSecurityLogs
);

/* ============================================================
   CHURCH APPLICATIONS
============================================================ */

const {
  getChurchApplicants,
  getChurchApplicantById,
  approveChurchApplicant,
  rejectChurchApplicant,
} = require("../controllers/ChurchApplicantController");

router.get(
  "/church-applicants",
  requirePlatform,
  getChurchApplicants
);

router.get(
  "/church-applicants/:applicationId",
  requirePlatform,
  getChurchApplicantById
);

router.patch(
  "/church-applicants/:applicationId/approve",
  requirePlatform,
  approveChurchApplicant
);

router.patch(
  "/church-applicants/:applicationId/reject",
  requirePlatform,
  rejectChurchApplicant
);

/* ============================================================
   CHURCHES
============================================================ */

const {
  getAllChurches,
  getChurchById,
  assignAuthority,
  suspend,
  activate,
} = require("../controllers/PlatformChurchController");

router.get(
  "/churches",
  requirePlatform,
  getAllChurches
);

router.get(
  "/churches/:churchId",
  requirePlatform,
  getChurchById
);

router.get(
  "/church/:churchId",
  requirePlatform,
  getChurchById
);

router.patch(
  "/churches/:churchId/suspend",
  requirePlatform,
  suspend
);

router.patch(
  "/churches/:churchId/activate",
  requirePlatform,
  activate
);

router.post(
  "/churches/:churchId/assign-authority",
  requirePlatform,
  assignAuthority
);

/* ============================================================
   COMMUNITY USERS (PLATFORM CONTROL)
============================================================ */

const {
  getUsers,
  block,
  unblock,
} = require("../controllers/PlatformUserController");

router.get(
  "/users",
  requirePlatform,
  getUsers
);

router.patch(
  "/users/:userId/block",
  requirePlatform,
  block
);

router.patch(
  "/users/:userId/unblock",
  requirePlatform,
  unblock
);

module.exports = router;

// src/routes/platform.routes.js

const express = require("express");
const router = express.Router();


const { authenticatePlatform } = require("../middleware/auth");

/* ============================================================
   DASHBOARD
============================================================ */

const { getDashboardStats } = require("../controllers/DashboardController");

router.get("/dashboard", authenticatePlatform, getDashboardStats);

/* ============================================================
   SECURITY LOGS
============================================================ */

const { getSecurityLogs } = require("../controllers/SecurityLogController");

router.get("/security-logs", authenticatePlatform, getSecurityLogs);

/* ============================================================
   CHURCH APPLICANTS
============================================================ */

const {
  getChurchApplicants,
  getChurchApplicantById,
  approveChurchApplicant,
  rejectChurchApplicant,
} = require("../controllers/ChurchApplicantController");



router.get(
  "/church-applicants",
  authenticatePlatform,
  getChurchApplicants
);

router.get(
  "/church-applicants/:applicationId",
  authenticatePlatform,
  getChurchApplicantById
);

router.patch(
  "/church-applicants/:applicationId/approve",
  authenticatePlatform,
  approveChurchApplicant
);

router.patch(
  "/church-applicants/:applicationId/reject",
  authenticatePlatform,
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

// ✅ LIST ALL APPROVED CHURCHES
router.get(
  "/churches",
  authenticatePlatform,
  getAllChurches
);

// ✅ GET CHURCH BY ID (plural – existing)
router.get(
  "/churches/:cid",
  authenticatePlatform,
  getChurchById
);

// ✅ GET CHURCH BY ID (singular – for frontend compatibility)
router.get(
  "/church/:cid",
  authenticatePlatform,
  getChurchById
);

// ✅ SUSPEND CHURCH
router.patch(
  "/churches/:cid/suspend",
  authenticatePlatform,
  suspend
);

// ✅ ACTIVATE CHURCH
router.patch(
  "/churches/:cid/activate",
  authenticatePlatform,
  activate
);

// ✅ ASSIGN AUTHORITY
router.post(
  "/churches/:cid/assign-authority",
  authenticatePlatform,
  assignAuthority
);

/* ============================================================
   USERS
============================================================ */

const {
  getUsers,
  block,
  unblock,
} = require("../controllers/PlatformUserController");

router.get(
  "/users",
  authenticatePlatform,
  getUsers
);

router.patch(
  "/users/:uid/block",
  authenticatePlatform,
  block
);

router.patch(
  "/users/:uid/unblock",
  authenticatePlatform,
  unblock
);
/* ============================================================
   BULK EMPLOYEE ASSIGNMENTS
============================================================ */

const upload = require("../middleware/UploadMiddleware");
const {
  getEmployeeAssignments,
  bulkAssignEmployees,
} = require("../controllers/EmployeeAssignmentController");

router.post(
  "/employee-assignments/bulk",
  authenticatePlatform,
  upload.single("file"),
  bulkAssignEmployees
);

router.get(
  "/employee-assignments",
  authenticatePlatform,
  getEmployeeAssignments
);

/* ============================================================
   EXPORTS
============================================================ */

module.exports = router;

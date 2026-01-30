const express = require("express");
const router = express.Router();

const { authenticatePlatform } = require("../middleware/auth");

/* ================= DASHBOARD ================= */
const { getDashboardStats } = require("../controllers/DashboardController");

/* ================= SECURITY LOGS ================= */
const { getSecurityLogs } = require("../controllers/SecurityLogController");

/* ================= CHURCH APPLICANTS ================= */
const {
  getChurchApplicants,
  getChurchApplicantById,
  createChurchApplicant,
  approveChurchApplicant,
  rejectChurchApplicant,
} = require("../controllers/ChurchApplicantController");

/* ================= CHURCH APPLICANTS ROUTES ================= */
router.post("/church-applicants", authenticatePlatform, createChurchApplicant);
router.get("/church-applicants", authenticatePlatform, getChurchApplicants);
router.get(
  "/church-applicants/:applicationId",
  authenticatePlatform,
  getChurchApplicantById
);
router.post(
  "/church-applicants/:applicationId/approve",
  authenticatePlatform,
  approveChurchApplicant
);
router.post(
  "/church-applicants/:applicationId/reject",
  authenticatePlatform,
  rejectChurchApplicant
);

/* ================= CHURCHES ================= */
const {
  getAllChurches,
  assignAuthority,
  suspend,
  activate,
  getChurchById,
} = require("../controllers/PlatformChurchController");

router.get("/church/all", authenticatePlatform, getAllChurches);
router.get("/church/:churchId", authenticatePlatform, getChurchById);
router.post(
  "/church/:cid/assign-authority",
  authenticatePlatform,
  assignAuthority
);
router.post("/church/:cid/suspend", authenticatePlatform, suspend);
router.post("/church/:cid/activate", authenticatePlatform, activate);

/* ================= USERS ================= */
const {
  getUsers,
  block,
  unblock,
} = require("../controllers/PlatformUserController");

router.get("/users", authenticatePlatform, getUsers);
router.post("/user/:uid/block", authenticatePlatform, block);
router.post("/user/:uid/unblock", authenticatePlatform, unblock);

/* ================= DASHBOARD ================= */
router.get("/dashboard", authenticatePlatform, getDashboardStats);

/* ================= SECURITY LOGS ================= */
router.get("/security-logs", authenticatePlatform, getSecurityLogs);

module.exports = router;

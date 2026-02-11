const express = require("express");
const router = express.Router();

const authenticate  = require("../middleware/auth");

/* ============================================================
   DASHBOARD
============================================================ */

const { getDashboardStats } = require("../controllers/DashboardController");

router.get("/dashboard", authenticate, getDashboardStats);

/* ============================================================
   SECURITY LOGS
============================================================ */

const { getSecurityLogs } = require("../controllers/SecurityLogController");

router.get("/security-logs", authenticate, getSecurityLogs);

/* ============================================================
   CHURCH APPLICATIONS
============================================================ */

const {
  getChurchApplicants,
  getChurchApplicantById,
  approveChurchApplicant,
  rejectChurchApplicant,
} = require("../controllers/ChurchApplicantController");

router.get("/church-applicants", authenticate, getChurchApplicants);
router.get("/church-applicants/:applicationId", authenticate, getChurchApplicantById);
router.patch("/church-applicants/:applicationId/approve", authenticate, approveChurchApplicant);
router.patch("/church-applicants/:applicationId/reject", authenticate, rejectChurchApplicant);

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

router.get("/churches", authenticate, getAllChurches);
router.get("/churches/:churchId", authenticate, getChurchById);
router.patch("/churches/:churchId/suspend", authenticate, suspend);
router.patch("/churches/:churchId/activate", authenticate, activate);
router.post("/churches/:churchId/assign-authority", authenticate, assignAuthority);

/* ============================================================
   USERS
============================================================ */

const {
  getUsers,
  block,
  unblock,
} = require("../controllers/PlatformUserController");

router.get("/users", authenticate, getUsers);
router.patch("/users/:userId/block", authenticate, block);
router.patch("/users/:userId/unblock", authenticate, unblock);

module.exports = router;

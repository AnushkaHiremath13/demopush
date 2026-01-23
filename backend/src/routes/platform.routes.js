const express = require("express");
const router = express.Router();

const { authenticatePlatform } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/DashboardController");

const {
  register,
  fetchPending,
  approve,
  reject,
  assignAuthority,
  getAllChurches,
  suspend,
  activate,
} = require("../controllers/PlatformChurchController");

/* ================= CHURCH REGISTRATION ================= */

router.post(
  "/church/register",
  authenticatePlatform,
  register
);

/* ================= ALL APPROVED CHURCHES ================= */

router.get(
  "/church/all",
  authenticatePlatform,
  getAllChurches
);

/* ================= PENDING CHURCHES ================= */

router.get(
  "/church/pending",
  authenticatePlatform,
  fetchPending
);

/* ================= APPROVAL ACTIONS ================= */

router.post(
  "/church/:cid/approve",
  authenticatePlatform,
  approve
);

router.post(
  "/church/:cid/reject",
  authenticatePlatform,
  reject
);

/* ================= AUTHORITY ================= */

router.post(
  "/church/:cid/assign-authority",
  authenticatePlatform,
  assignAuthority
);

/* ================= STATUS CONTROL ================= */

router.post(
  "/church/:cid/suspend",
  authenticatePlatform,
  suspend
);

router.post(
  "/church/:cid/activate",
  authenticatePlatform,
  activate
);

/* ================= DASHBOARD ================= */

router.get(
  "/dashboard",
  authenticatePlatform,
  getDashboardStats
);

const {
  getUsers,
  block,
  unblock,
} = require("../controllers/PlatformUserController");

/* ================= PLATFORM USERS ================= */

router.get(
  "/users",
  authenticatePlatform,
  getUsers
);

router.post(
  "/user/:uid/block",
  authenticatePlatform,
  block
);

router.post(
  "/user/:uid/unblock",
  authenticatePlatform,
  unblock
);

const { getSecurityLogs } = require("../controllers/SecurityLogController");

router.get(
  "/security-logs",
  authenticatePlatform,
  getSecurityLogs
);

module.exports = router;

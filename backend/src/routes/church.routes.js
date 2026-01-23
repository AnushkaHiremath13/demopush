const express = require("express");
const router = express.Router();

const {
  pending,
  approve,
  reject,
} = require("../controllers/ChurchFollowerController");

const { authenticateChurchAuthority } =require("../middleware/auth");

/* ================= FOLLOWER APPROVAL ================= */

router.get("/church/followers/pending", authenticateChurchAuthority, pending);
router.post("/church/follower/:uid/approve", authenticateChurchAuthority, approve);
router.post("/church/follower/:uid/reject", authenticateChurchAuthority, reject);

module.exports = router;

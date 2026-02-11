const express = require("express");
const router = express.Router();

const {
  createChurchApplicant,
} = require("../controllers/ChurchApplicantController");
//const { authenticate } = require("../middleware/auth");

/* ============================================================
   PUBLIC – CHURCH APPLICATION
============================================================ */

router.post("/apply", createChurchApplicant);
//  //🚫 COMMUNITY ROUTES DISABLED FOR NOW
// router.get("/followers/pending", authenticate, pending);
//  router.patch("/followers/:userId/approve", authenticate, approve);
//  router.patch("/followers/:userId/reject", authenticate, reject);

module.exports = router;

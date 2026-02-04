const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { getMe } = require("../controllers/UserController");

router.get("/me", authenticateUser, getMe);

module.exports = router;

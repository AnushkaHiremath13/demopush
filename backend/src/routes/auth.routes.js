/* const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

module.exports = router; */
const express = require("express");
const router = express.Router();

const { login, register, logout } = require("../controllers/auth.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);

// 🔒 Logout (protected)
router.post("/logout", authenticate, logout);

module.exports = router;

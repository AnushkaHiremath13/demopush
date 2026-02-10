// src/controllers/AuthController.js

const {
  registerUser,
  loginUser,
} = require("../services/AuthService");

/* ============================================================
   REGISTER (COMMUNITY USER ONLY)
============================================================ */

async function register(req, res) {
  try {
    const {
      usr_name,
      usr_email,
      usr_phone,
      usr_password,
      usr_confirm_password,
    } = req.body;

    if (!usr_name || !usr_email || !usr_password || !usr_confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (usr_password !== usr_confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await registerUser({
      usr_name,
      usr_email,
      usr_phone,
      usr_password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   LOGIN (COMMUNITY | PLATFORM)
============================================================ */
async function login(req, res) {
  try {
    const { email, password, login_scope } = req.body;

    console.log("🔥 LOGIN SERVICE HIT 🔥", req.body);

    if (!email || !password || !login_scope) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and login scope are required",
      });
    }

    const result = await loginUser({
      email,
      password,
      login_scope,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      scope: result.scope,
      identity: result.identity,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}



/* ============================================================
   LOGOUT
============================================================ */

function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

module.exports = {
  register,
  login,
  logout,
};

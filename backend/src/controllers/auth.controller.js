// src/controllers/auth.controller.js

const { registerUser, loginUser } = require("../services/auth.service");

/* ============================================================
   REGISTER
============================================================ */

async function register(req, res) {
  try {
    const {
      uname,
      uemail,
      uphone,
      upassword,
      uconfirmpassword,
      ccode,
    } = req.body;

    if (!uname || !uemail || !upassword || !uconfirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (upassword !== uconfirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await registerUser({
      uname,
      uemail,
      upassword,
      uphone,
      ccode,
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
   LOGIN
============================================================ */

async function login(req, res) {
  try {
    const { uemail, upassword } = req.body;

    if (!uemail || !upassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { token, userType, redirectTo } =
      await loginUser({ uemail, upassword });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userType,
      redirectTo,
    });
  } catch (error) {
    /* 🔐 AUTH vs AUTHZ vs BUSINESS RULE */
    let statusCode = 401;

    if (
      error.message.includes("pending") ||
      error.message.includes("not linked") ||
      error.message.includes("not authorized")
    ) {
      statusCode = 403;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   LOGOUT
============================================================ */

async function logout(req, res) {
  // Stateless JWT logout (client removes token)
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  register,
  login,
  logout,
};

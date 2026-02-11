const {
  registerUser,
  loginUser,
} = require("../services/AuthService");

/* ================= REGISTER ================= */

async function register(req, res) {
  try {
    const { name, email, password, church_code } = req.body;

    if (!name || !email || !password || !church_code) {
      return res.status(400).json({
        success: false,
        message: "All fields including church code are required",
      });
    }

    const user = await registerUser({
      name,
      email,
      password,
      church_code,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

/* ================= LOGIN ================= */

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const { token } = await loginUser({ email, password });

    return res.json({
      success: true,
      token,
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

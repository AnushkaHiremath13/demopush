const { registerUser, loginUser } = require("../services/auth.service");

/* ================= REGISTER ================= */

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
        message: "Required fields are missing",
      });
    }

    if (upassword !== uconfirmpassword) {
      return res.status(400).json({
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
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ================= LOGIN ================= */

async function login(req, res) {
  try {
    const { uemail, upassword } = req.body;

    if (!uemail || !upassword) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const { token, userType, redirectTo } =
      await loginUser({ uemail, upassword });

    return res.status(200).json({
      message: "Login successful",
      token,
      userType,
      redirectTo,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}


module.exports = {register,login};

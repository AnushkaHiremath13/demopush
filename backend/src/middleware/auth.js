const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/token");
/* ================= BASE AUTH ================= */

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: `${err.message || "Invalid or expired token"}`,
    });
  }
}

/* ================= PLATFORM ================= */

function requirePlatform(req, res, next) {
  authenticate(req, res, () => {
    if (!req.auth || req.auth.scope !== "PLATFORM" || !req.auth.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform access required",
      });
    }

    // 🔥 THIS IS WHAT YOUR CONTROLLERS EXPECT
    req.platform = {
      plt_id: req.auth.plt_id,
    };

    next();
  });
}


/* ================= COMMUNITY ================= */

function requireCommunity(req, res, next) {
  authenticate(req, res, () => {
    if (!req.auth || req.auth.scope !== "COMMUNITY" || !req.auth.usr_id) {
      return res.status(403).json({
        success: false,
        message: "Community access required",
      });
    }

    req.user = {
      usr_id: req.auth.usr_id,
    };

    next();
  });
}
module.exports = {
  authenticate,
  requirePlatform,
  requireCommunity,
};

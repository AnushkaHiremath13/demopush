const jwt = require("jsonwebtoken");

/* ================= AUTHENTICATE USER ================= */

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

/* ================= AUTHENTICATE PLATFORM ================= */

function authenticatePlatform(req, res, next) {
  authenticateUser(req, res, () => {
    if (!req.user || req.user.userType !== "PLATFORM") {
      return res.status(403).json({
        message: "Platform access required",
      });
    }
    next();
  });
}

/* ================= AUTHENTICATE CHURCH AUTHORITY ================= */

function authenticateChurchAuthority(req, res, next) {
  authenticateUser(req, res, () => {
    if (!req.user || req.user.userType !== "CHURCH_AUTHORITY") {
      return res.status(403).json({
        message: "Church authority access required",
      });
    }
    next();
  });
}

/* ================= EXPORTS ================= */

module.exports = {
  authenticateUser,
  authenticatePlatform,
  authenticateChurchAuthority,
};

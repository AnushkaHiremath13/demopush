const jwt = require("jsonwebtoken");

/* ================= GENERATE TOKEN ================= */

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}


/* ================= VERIFY TOKEN ================= */

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};

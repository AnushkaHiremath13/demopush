// src/utils/token.js

const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY = process.env.JWT_EXPIRY || "1d";

function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

module.exports = { generateToken };

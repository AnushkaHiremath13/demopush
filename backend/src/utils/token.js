// src/utils/token.js

const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY = process.env.JWT_EXPIRY || "1d";
const JWT_ISSUER = process.env.JWT_ISSUER || "community-platform";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "web-client";

/* ============================================================
   GENERATE TOKEN
============================================================ */

function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid token payload");
  }

  // Enforce allowed payload structure
  const safePayload = {
    scope: payload.scope,
    usr_id: payload.usr_id || null,
    plt_id: payload.plt_id || null,
  };

  if (!safePayload.scope) {
    throw new Error("JWT scope is required");
  }

  return jwt.sign(safePayload, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: "HS256",
  });
}

/* ============================================================
   VERIFY TOKEN
============================================================ */

function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};

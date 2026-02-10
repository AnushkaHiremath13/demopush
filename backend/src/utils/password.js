// src/utils/password.js

const bcrypt = require("bcrypt");

const DEFAULT_SALT_ROUNDS = 10;
const SALT_ROUNDS =
  Number(process.env.BCRYPT_SALT_ROUNDS) >= 8
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : DEFAULT_SALT_ROUNDS;

/* ============================================================
   HASH PASSWORD
============================================================ */

async function hashPassword(password) {
  if (
    typeof password !== "string" ||
    password.trim().length < 8
  ) {
    throw new Error("Password must be at least 8 characters long");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

/* ============================================================
   COMPARE PASSWORD
============================================================ */

async function comparePassword(password, hashedPassword) {
  if (
    typeof password !== "string" ||
    typeof hashedPassword !== "string"
  ) {
    return false;
  }

  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};

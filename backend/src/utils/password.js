// src/utils/password.js

const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};

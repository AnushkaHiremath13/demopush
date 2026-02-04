// src/config/prisma.js
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient({
  log: ["error", "warn"], // optional but good
});

module.exports = prisma;

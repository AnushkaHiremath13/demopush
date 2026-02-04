// src/services/PlatformUserService.js

const prisma = require("../config/prisma");

/* ============================================================
   GET ALL PLATFORM USERS
============================================================ */

async function getAllPlatformUsers() {
  const users = await prisma.tbluser1.findMany({
    select: {
      uid: true,
      uname: true,
      uemail: true,
      uisplatform: true,
      uisemployee: true,
      ustatus: true,
      createdat: true,
    },
    orderBy: {
      createdat: "desc",
    },
  });

  return users;
}

/* ============================================================
   BLOCK USER
============================================================ */

async function blockUser({ uid }) {
  const result = await prisma.tbluser1.updateMany({
    where: { uid },
    data: { ustatus: "BLOCKED" },
  });

  if (result.count === 0) {
    throw new Error("User not found");
  }

  return { uid, status: "BLOCKED" };
}

/* ============================================================
   UNBLOCK USER
============================================================ */

async function unblockUser({ uid }) {
  const result = await prisma.tbluser1.updateMany({
    where: { uid },
    data: { ustatus: "ACTIVE" },
  });

  if (result.count === 0) {
    throw new Error("User not found");
  }

  return { uid, status: "ACTIVE" };
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
};

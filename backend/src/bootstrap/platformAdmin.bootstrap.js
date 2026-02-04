// src/bootstrap/platformAdmin.bootstrap.js

const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

async function createPlatformAdminIfNotExists() {
  try {
    /* ============================================================
       CHECK IF PLATFORM ADMIN EXISTS
    ============================================================ */

    const existingAdmin = await prisma.tbluser1.findFirst({
      where: {
        uisplatform: true,
      },
      select: {
        uid: true,
      },
    });

    if (existingAdmin) {
      console.log("✅ Platform admin already exists");
      return;
    }

    /* ============================================================
       CREATE PLATFORM ADMIN
    ============================================================ */

    const hashedPassword = await bcrypt.hash("Platform@powaha6", 10);

    await prisma.tbluser1.create({
      data: {
        uname: "Platform Admin",
        uemail: "admin@powaha.com",
        upassword: hashedPassword,

        uisplatform: true,
        uisemployee: false,
        uisfollower: false,

        uemailverified: true,
        uphoneverified: true,
        ustatus: "ACTIVE",
      },
    });

    console.log("🚀 Platform admin bootstrapped successfully");
  } catch (error) {
    console.error("❌ Platform admin bootstrap failed:", error.message);
  }
}

module.exports = createPlatformAdminIfNotExists;

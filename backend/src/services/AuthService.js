const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

/* ================= REGISTER ================= */

async function registerUser({ name, email, password, church_code }) {
  const existing = await prisma.tbl_user_1.findUnique({
    where: { usr_email: email.toLowerCase() },
  });

  if (existing) {
    throw new Error("Email already registered");
  }

  // 🔥 validate church code
  const church = await prisma.tbl_church.findUnique({
    where: { chr_code: church_code },
  });

  if (!church) {
    throw new Error("Invalid church code");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.tbl_user_1.create({
      data: {
        usr_name: name,
        usr_email: email.toLowerCase(),
        usr_password: hashed,
        usr_status: "ACTIVE",
      },
    });

    // attach user to church
    await tx.tbl_church_user.create({
      data: {
        usr_id: createdUser.usr_id,
        chr_id: church.chr_id,
        chr_usr_status: "ACTIVE",
      },
    });

    return createdUser;
  });

  return {
    usr_id: user.usr_id,
    email: user.usr_email,
  };
}

/* ================= LOGIN ================= */
async function loginUser({ email, password }) {
  const admin = await prisma.tbl_platform_1.findUnique({
    where: { plt_email: email.toLowerCase() },
  });

  if (!admin || admin.plt_status !== "ACTIVE") {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, admin.plt_password);
  if (!match) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    plt_id: admin.plt_id,
    email: admin.plt_email,
    role: "PLATFORM_ADMIN"   // optional but recommended
  });

  return { token };
}

module.exports = {
  registerUser,
  loginUser,
};

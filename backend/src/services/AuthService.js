// src/services/AuthService.js

const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

/* ============================================================
   REGISTER COMMUNITY USER
============================================================ */

async function registerUser(data) {
  const { usr_name, usr_email, usr_phone, usr_password } = data;

  const email = usr_email.toLowerCase();

  const existingUser = await prisma.tbl_user_1.findUnique({
    where: { usr_email: email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(usr_password, 10);

  const followerRole = await prisma.tbl_role_master.findUnique({
    where: { role_code: "FOLLOWER" },
  });

  if (!followerRole) {
    throw new Error("FOLLOWER role not configured");
  }

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.tbl_user_1.create({
      data: {
        usr_name,
        usr_email: email,
        usr_phone: usr_phone || null,
        usr_password: hashedPassword,
        usr_status: "ACTIVE",
      },
    });

    await tx.tbl_church_user.create({
      data: {
        usr_id: createdUser.usr_id,
        role_id: followerRole.role_id,
        chr_id: null,
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "COMMUNITY",
        adt_entity_type: "USER",
        adt_entity_id: createdUser.usr_id,
        adt_action: "REGISTER",
        adt_actor_context: "SELF",
      },
    });

    return createdUser;
  });

  return {
    usr_id: user.usr_id,
    usr_email: user.usr_email,
  };
}
/* ============================================================
   LOGIN (PLATFORM ADMIN OR COMMUNITY USER)
============================================================ */

async function loginUser({ email, password, login_scope }) {
  if (!email || !password || !login_scope) {
    throw new Error("Email, password, and login scope are required");
  }

  const normalizedEmail = email.toLowerCase();

  /* ===================== PLATFORM ADMIN LOGIN ===================== */
  if (login_scope === "PLATFORM") {
    const platformAdmin = await prisma.tbl_platform_1.findUnique({
      where: {
        plt_email: normalizedEmail,
      },
    });

    if (!platformAdmin || platformAdmin.plt_status !== "ACTIVE") {
      throw new Error("Invalid email or password");
    }

    const match = await bcrypt.compare(
      password,
      platformAdmin.plt_password
    );

    if (!match) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({
      scope: "PLATFORM",
      plt_id: platformAdmin.plt_id,
    });

    return {
      token,
      scope: "PLATFORM",
      identity: {
        plt_id: platformAdmin.plt_id,
        email: platformAdmin.plt_email,
      },
    };
  }

  /* ===================== COMMUNITY USER LOGIN ===================== */
  if (login_scope === "COMMUNITY") {
    const user = await prisma.tbl_user_1.findUnique({
      where: {
        usr_email: normalizedEmail,
      },
    });

    if (!user || user.usr_status !== "ACTIVE") {
      throw new Error("Invalid email or password");
    }

    const match = await bcrypt.compare(
      password,
      user.usr_password
    );

    if (!match) {
      throw new Error("Invalid email or password");
    }

    const roles = await prisma.tbl_church_user.findMany({
      where: {
        usr_id: user.usr_id,
        chr_usr_status: "ACTIVE",
      },
      include: {
        role: true,
      },
    });

    const token = generateToken({
      scope: "COMMUNITY",
      usr_id: user.usr_id,
      roles: roles.map(r => r.role.role_code),
    });

    return {
      token,
      scope: "COMMUNITY",
      identity: {
        usr_id: user.usr_id,
        email: user.usr_email,
      },
    };
  }

  throw new Error("Invalid login scope");
}


module.exports = {
  registerUser,
  loginUser,
};

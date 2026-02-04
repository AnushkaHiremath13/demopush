// src/services/auth.service.js

const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");
const { v7: uuidv7 } = require("uuid");

/* ============================================================
   REGISTER USER
============================================================ */

async function registerUser(data) {
  const { uname, uemail, upassword, uphone, ccode } = data;

  /* 1️⃣ Check if email already exists */
  const existingUser = await prisma.tbluser1.findUnique({
    where: { uemail },
    select: { uid: true },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  /* 2️⃣ Hash password */
  const passwordHash = await hashPassword(upassword);

  /* 3️⃣ Generate UUID */
  const uid = uuidv7();

  /* 4️⃣ Insert user (default follower) */
  await prisma.tbluser1.create({
    data: {
      uid,
      uname,
      uemail,
      upassword: passwordHash,
      uphone: uphone || null,
      ccode: ccode || null,

      uisplatform: false,
      uisemployee: false,
      uisfollower: true,
    },
  });

  return {
    uid,
    uemail,
  };
}

/* ============================================================
   LOGIN USER
============================================================ */

async function loginUser({ uemail, upassword }) {
  /* 1️⃣ Find active user */
  const user = await prisma.tbluser1.findFirst({
    where: {
      uemail,
      ustatus: "ACTIVE",
    },
    select: {
      uid: true,
      uemail: true,
      upassword: true,
      uisplatform: true,
      uisemployee: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  /* 2️⃣ Verify password */
  const isMatch = await comparePassword(upassword, user.upassword);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  /* ============================================================
     PLATFORM ADMIN LOGIN
  ============================================================ */
  if (user.uisplatform === true) {
    const token = generateToken({
      uid: user.uid,
      userType: "PLATFORM",
    });

    return {
      token,
      userType: "PLATFORM",
      redirectTo: "/admin/dashboard",
    };
  }

  /* ============================================================
     CHURCH AUTHORITY LOGIN
  ============================================================ */
  if (user.uisemployee === true) {
    const token = generateToken({
      uid: user.uid,
      userType: "CHURCH_AUTHORITY",
    });

    return {
      token,
      userType: "CHURCH_AUTHORITY",
      redirectTo: "/church/dashboard",
    };
  }

  /* ============================================================
     FOLLOWER APPROVAL CHECK
  ============================================================ */
  const churchLink = await prisma.tblchurch_user.findFirst({
    where: {
      uid: user.uid,
    },
    select: {
      approvalstatus: true,
    },
  });

  if (!churchLink) {
    throw new Error("User is not linked to any church");
  }

  if (churchLink.approvalstatus !== "APPROVED") {
    throw new Error("Your account is pending approval by the church");
  }

  /* ============================================================
     APPROVED FOLLOWER LOGIN
  ============================================================ */
  const token = generateToken({
    uid: user.uid,
    userType: "USER",
  });

  return {
    token,
    userType: "USER",
    redirectTo: "/user",
  };
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  registerUser,
  loginUser,
};

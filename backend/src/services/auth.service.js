const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");
const { v7: uuidv7 } = require("uuid");

/* ================= REGISTER USER ================= */

async function registerUser(data) {
  const { uname, uemail, upassword, uphone, ccode } = data;

  // 1. Check email existence
  const emailCheck = await pool.query(
    "SELECT 1 FROM tbluser1 WHERE uemail = $1",
    [uemail]
  );

  if (emailCheck.rowCount > 0) {
    throw new Error("Email already registered");
  }

  // 2. Hash password
  const passwordHash = await hashPassword(upassword);

  // 3. Generate UUID
  const uid = uuidv7();

  // 4. Insert user (default follower)
  await pool.query(
    `
    INSERT INTO tbluser1 (
      uid, uname, uemail, upassword, uphone, ccode,
      uisplatform, uisemployee, uisfollower
    )
    VALUES ($1, $2, $3, $4, $5, $6, false, false, true)
    `,
    [uid, uname, uemail, passwordHash, uphone || null, ccode || null]
  );

  return { uid, uemail };
}

/* ================= LOGIN USER ================= */


async function loginUser({ uemail, upassword }) {
  /* ================= FIND USER ================= */

  const userResult = await pool.query(
    `
    SELECT uid, uemail, upassword, uisplatform
    FROM tbluser1
    WHERE uemail = $1
      AND ustatus = 'ACTIVE'
    `,
    [uemail]
  );

  if (userResult.rowCount === 0) {
    throw new Error("Invalid email or password");
  }

  const user = userResult.rows[0];

  /* ================= VERIFY PASSWORD ================= */

  const isMatch = await comparePassword(upassword, user.upassword);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  /* ================= PLATFORM ADMIN ================= */

  if (user.uisplatform) {
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

  /* ================= CHURCH AUTHORITY ================= */

 async function loginUser({ uemail, upassword }) {
  const result = await pool.query(
    "SELECT * FROM tbluser1 WHERE uemail = $1",
    [uemail]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(upassword, user.upassword);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  /* 🔑 DETERMINE ROLE */
  let userType = "FOLLOWER";
  let redirectTo = "/home";

  if (user.uisplatform === true) {
    userType = "PLATFORM";
    redirectTo = "/platform/dashboard";
  } else if (user.uisemployee === true) {
    userType = "CHURCH_AUTHORITY";
    redirectTo = "/church/dashboard";
  }

  /* 🔐 SIGN JWT (THIS FIXES 403 ISSUE) */
  const token = jwt.sign(
    {
      uid: user.uid,
      userType, // ✅ CRITICAL
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    userType,
    redirectTo,
  };
}


  /* ================= FOLLOWER APPROVAL CHECK ================= */

  const followerCheck = await pool.query(
    `
    SELECT approvalstatus
    FROM tblchurch_user
    WHERE uid = $1
    `,
    [user.uid]
  );

  if (followerCheck.rowCount === 0) {
    throw new Error("User is not linked to any church");
  }

  if (followerCheck.rows[0].approvalstatus !== "APPROVED") {
    throw new Error("Your account is pending approval by the church");
  }

  /* ================= APPROVED FOLLOWER ================= */

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

module.exports = {
  registerUser,
  loginUser,
};

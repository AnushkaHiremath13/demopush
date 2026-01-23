const pool = require("../config/db");

/* ================= GET ALL USERS ================= */

async function getAllPlatformUsers() {
  const result = await pool.query(`
    SELECT
      uid,
      uname,
      uemail,
      uisplatform,
      uisemployee,
      ustatus,
      createdat
    FROM tbluser1
    ORDER BY createdat DESC
  `);

  return result.rows;
}

/* ================= BLOCK USER ================= */

async function blockUser({ uid }) {
  const result = await pool.query(
    `
    UPDATE tbluser1
    SET ustatus = 'BLOCKED'
    WHERE uid = $1
    RETURNING uid
    `,
    [uid]
  );

  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
}

/* ================= UNBLOCK USER ================= */

async function unblockUser({ uid }) {
  const result = await pool.query(
    `
    UPDATE tbluser1
    SET ustatus = 'ACTIVE'
    WHERE uid = $1
    RETURNING uid
    `,
    [uid]
  );

  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
}

module.exports = {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
};

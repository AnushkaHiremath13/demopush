const pool = require("../config/db");

/* ================= CHECK AUTHORIZED HANDLER ================= */

async function isAuthorizedHandler({ handlerUid, cid }) {
  const result = await pool.query(
    `
    SELECT 1
    FROM tblchurch_user
    WHERE uid = $1
      AND cid = $2
      AND approvalstatus = 'APPROVED'
      AND createdby IN (
        SELECT uid FROM tbluser1 WHERE uisplatform = true
      )
    `,
    [handlerUid, cid]
  );

  return result.rowCount > 0;
}

/* ================= GET PENDING FOLLOWERS ================= */

async function getPendingFollowers({ handlerUid }) {
  // Find church of handler
  const churchResult = await pool.query(
    `
    SELECT cid
    FROM tblchurch_user
    WHERE uid = $1
      AND approvalstatus = 'APPROVED'
    `,
    [handlerUid]
  );

  if (churchResult.rowCount === 0) {
    throw new Error("User is not linked to any church");
  }

  const cid = churchResult.rows[0].cid;

  // Verify authority
  const authorized = await isAuthorizedHandler({ handlerUid, cid });
  if (!authorized) {
    throw new Error("Not authorized to approve followers");
  }

  // Fetch pending followers
  const followers = await pool.query(
    `
    SELECT
      u.uid,
      u.uname,
      u.uemail,
      cu.createdat
    FROM tblchurch_user cu
    JOIN tbluser1 u ON u.uid = cu.uid
    WHERE cu.cid = $1
      AND cu.approvalstatus = 'PENDING'
    ORDER BY cu.createdat ASC
    `,
    [cid]
  );

  return followers.rows;
}

/* ================= APPROVE FOLLOWER ================= */

async function approveFollower({ handlerUid, followerUid }) {
  const churchResult = await pool.query(
    `
    SELECT cid
    FROM tblchurch_user
    WHERE uid = $1
      AND approvalstatus = 'APPROVED'
    `,
    [handlerUid]
  );

  if (churchResult.rowCount === 0) {
    throw new Error("User is not linked to any church");
  }

  const cid = churchResult.rows[0].cid;

  const authorized = await isAuthorizedHandler({ handlerUid, cid });
  if (!authorized) {
    throw new Error("Not authorized to approve followers");
  }

  const result = await pool.query(
    `
    UPDATE tblchurch_user
    SET approvalstatus = 'APPROVED',
        createdby = $1
    WHERE uid = $2
      AND cid = $3
      AND approvalstatus = 'PENDING'
    RETURNING uid
    `,
    [handlerUid, followerUid, cid]
  );

  if (result.rowCount === 0) {
    throw new Error("Follower not found or already processed");
  }

  return { uid: followerUid };
}

/* ================= REJECT FOLLOWER ================= */

async function rejectFollower({ handlerUid, followerUid }) {
  const churchResult = await pool.query(
    `
    SELECT cid
    FROM tblchurch_user
    WHERE uid = $1
      AND approvalstatus = 'APPROVED'
    `,
    [handlerUid]
  );

  if (churchResult.rowCount === 0) {
    throw new Error("User is not linked to any church");
  }

  const cid = churchResult.rows[0].cid;

  const authorized = await isAuthorizedHandler({ handlerUid, cid });
  if (!authorized) {
    throw new Error("Not authorized to reject followers");
  }

  const result = await pool.query(
    `
    UPDATE tblchurch_user
    SET approvalstatus = 'REJECTED',
        createdby = $1
    WHERE uid = $2
      AND cid = $3
      AND approvalstatus = 'PENDING'
    RETURNING uid
    `,
    [handlerUid, followerUid, cid]
  );

  if (result.rowCount === 0) {
    throw new Error("Follower not found or already processed");
  }

  return { uid: followerUid };
}

module.exports = {
  getPendingFollowers,
  approveFollower,
  rejectFollower,
};

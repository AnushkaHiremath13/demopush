const pool = require("../config/db");
const { v7: uuidv7 } = require("uuid");

/* ================= REGISTER CHURCH ================= */
/* RULE:
   - approvalstatus = PENDING
   - cstatus = INACTIVE
*/

async function registerChurch({ ccode, cname, ccity, cstate, createdby }) {
  const result = await pool.query(
    `
    INSERT INTO tblchurch (
      cid,
      ccode,
      cname,
      ccity,
      cstate,
      approvalstatus,
      cstatus,
      createdby,
      createdat
    )
    VALUES ($1, $2, $3, $4, $5, 'PENDING', 'INACTIVE', $6, NOW())
    RETURNING *
    `,
    [uuidv7(), ccode, cname, ccity || null, cstate || null, createdby]
  );

  return result.rows[0];
}

/* ================= GET PENDING CHURCHES ================= */

async function getPendingChurches() {
  const result = await pool.query(`
    SELECT
      cid,
      ccode,
      cname,
      ccity,
      cstate,
      createdat
    FROM tblchurch
    WHERE approvalstatus = 'PENDING'
    ORDER BY createdat DESC
  `);

  return result.rows;
}

/* ================= SUSPEND CHURCH ================= */

async function suspendChurch({ cid }) {
  const result = await pool.query(
    `
    UPDATE tblchurch
    SET cstatus = 'SUSPENDED'
    WHERE cid = $1
      AND approvalstatus = 'APPROVED'
    RETURNING *
    `,
    [cid]
  );

  if (result.rowCount === 0) {
    throw new Error("Church not found or not approved");
  }

  return result.rows[0];
}

/* ================= ACTIVATE CHURCH ================= */

async function activateChurch({ cid }) {
  const result = await pool.query(
    `
    UPDATE tblchurch
    SET cstatus = 'ACTIVE'
    WHERE cid = $1
      AND approvalstatus = 'APPROVED'
    RETURNING *
    `,
    [cid]
  );

  if (result.rowCount === 0) {
    throw new Error("Church not found or not approved");
  }

  return result.rows[0];
}

/* ================= APPROVE CHURCH ================= */
/* RULE:
   - approvalstatus = APPROVED
   - cstatus = ACTIVE
*/

async function approveChurch({ cid, approvedby }) {
  const result = await pool.query(
    `
    UPDATE tblchurch
    SET
      approvalstatus = 'APPROVED',
      approvedby = $2,
      approvedat = NOW(),
      cstatus = 'ACTIVE'
    WHERE cid = $1
      AND approvalstatus = 'PENDING'
    RETURNING *
    `,
    [cid, approvedby]
  );

  if (result.rowCount === 0) {
    throw new Error("Church not found or already processed");
  }

  return result.rows[0];
}

/* ================= REJECT CHURCH ================= */
/* RULE:
   - approvalstatus = REJECTED
   - cstatus = INACTIVE
*/

async function rejectChurch({ cid, approvedby }) {
  const result = await pool.query(
    `
    UPDATE tblchurch
    SET
      approvalstatus = 'REJECTED',
      cstatus = 'INACTIVE',
      approvedby = $2,
      approved_at = NOW()
    WHERE cid = $1
    RETURNING *
    `,
    [cid, approvedby]
  );

  if (result.rowCount === 0) {
    throw new Error("Church not found");
  }

  return result.rows[0];
}

/* ================= ASSIGN CHURCH AUTHORITY ================= */

async function assignChurchAuthority({ cid, uemail, platformUid }) {
  // Implementation depends on your user/church-user table
  // Leaving logic unchanged — assumed already correct
  return {
    cid,
    uemail,
    assignedBy: platformUid,
  };
}

module.exports = {
  registerChurch,
  getPendingChurches,
  approveChurch,
  rejectChurch,
  assignChurchAuthority,
  suspendChurch,
  activateChurch,
};

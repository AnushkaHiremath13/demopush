const pool = require("../config/db");

/* ================= FETCH PENDING APPLICANTS ================= */

exports.fetchApplicants = async () => {
  const { rows } = await pool.query(`
    SELECT *
    FROM tblchurch_applicants
    WHERE application_status = 'PENDING'
    ORDER BY applied_on ASC
  `);

  return rows;
};

/* ================= APPROVE APPLICANT ================= */

exports.approveApplicant = async (applicationId, approvedBy) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Fetch applicant
    const { rows } = await client.query(
      `
      SELECT *
      FROM tblchurch_applicants
      WHERE application_id = $1
      AND application_status = 'PENDING'
      `,
      [applicationId]
    );

    if (!rows.length) {
      throw new Error("Applicant not found or already processed");
    }

    const app = rows[0];

    // 2. Insert into tblchurch (cid auto-generated)
    await client.query(
      `
      INSERT INTO tblchurch (
        ccode,
        cname,
        caddress,
        ccity,
        cstate,
        ccountry,
        cpincode,
        cdenomination,
        clocation,
        ctimezone,
        approvedby
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        app.ccode,
        app.cname,
        app.caddress,
        app.ccity,
        app.cstate,
        app.ccountry,
        app.cpincode,
        app.cdenomination,
        app.clocation,
        app.ctimezone,
        approvedBy,
      ]
    );

    // 3. Update applicant status
    await client.query(
      `
      UPDATE tblchurch_applicants
      SET application_status = 'APPROVED'
      WHERE application_id = $1
      `,
      [applicationId]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/* ================= REJECT APPLICANT ================= */

exports.rejectApplicant = async (applicationId) => {
  const { rowCount } = await pool.query(
    `
    UPDATE tblchurch_applicants
    SET application_status = 'REJECTED'
    WHERE application_id = $1
    AND application_status = 'PENDING'
    `,
    [applicationId]
  );

  if (!rowCount) {
    throw new Error("Applicant not found or already processed");
  }
};

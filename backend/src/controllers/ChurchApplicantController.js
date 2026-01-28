const pool = require("../config/db");

/* ================= CREATE CHURCH APPLICATION ================= */

exports.createChurchApplicant = async (req, res) => {
  try {
    const {
      ccode,
      cname,
      caddress,
      cemail,
      ccity,
      cstate,
      ccountry,
      cpincode,
      cdenomination,
      clocation,
      ctimezone,
    } = req.body;

    if (!ccode || !cname) {
      return res.status(400).json({
        message: "Church code and name are required",
      });
    }

    await pool.query(
      `
      INSERT INTO tblchurch_applicants (
        ccode,
        cname,
        caddress,
        cemail,
        ccity,
        cstate,
        ccountry,
        cpincode,
        cdenomination,
        clocation,
        ctimezone
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        ccode,
        cname,
        caddress,
        cemail,
        ccity,
        cstate,
        ccountry,
        cpincode,
        cdenomination,
        clocation,
        ctimezone,
      ]
    );

    res.status(201).json({
      message: "Church application submitted successfully",
    });
  } catch (error) {
    console.error("Create applicant error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL PENDING APPLICANTS ================= */

exports.getChurchApplicants = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM tblchurch_applicants
      WHERE application_status = 'PENDING'
      ORDER BY applied_on DESC
      `
    );

    res.json(rows);
  } catch (error) {
    console.error("Fetch applicants error:", error.message);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

/* ================= GET SINGLE APPLICANT ================= */

exports.getChurchApplicantById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { rows } = await pool.query(
      `
      SELECT *
      FROM tblchurch_applicants
      WHERE application_id = $1
      `,
      [applicationId]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Church applicant not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Fetch applicant by id error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= APPROVE APPLICANT ================= */

exports.approveChurchApplicant = async (req, res) => {
  const { applicationId } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* 1️⃣ Fetch application */
    const { rows } = await client.query(
      `
      SELECT *
      FROM tblchurch_applicants
      WHERE application_id = $1
      `,
      [applicationId]
    );

    if (!rows.length) {
      throw new Error("Application not found");
    }

    const app = rows[0];

    /* 2️⃣ Insert into tblchurch */
    await client.query(
      `
      INSERT INTO tblchurch (
        cid,
        ccode,
        cname,
        ccity,
        cstate,
        ccountry,
        caddress,
        cpincode,
        ctimezone,
        cstatus,
        approvalstatus,
        createdat
      )
      VALUES (
        gen_random_uuid(),
        $1,$2,$3,$4,$5,$6,$7,$8,
        'ACTIVE',
        'APPROVED',
        NOW()
      )
      `,
      [
        app.ccode,
        app.cname,
        app.ccity,
        app.cstate,
        app.ccountry,
        app.caddress,
        app.cpincode,
        app.ctimezone,
      ]
    );

    /* 3️⃣ Update application status */
    await client.query(
      `
      UPDATE tblchurch_applicants
      SET
        application_status = 'APPROVED',
        approved_at = NOW()
      WHERE application_id = $1
      `,
      [applicationId]
    );

    await client.query("COMMIT");

    res.json({ message: "Church approved successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Approve error:", err.message);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

/* ================= REJECT APPLICANT ================= */

exports.rejectChurchApplicant = async (req, res) => {
  try {
    const { applicationId } = req.params;

    await pool.query(
      `
      UPDATE tblchurch_applicants
      SET
        application_status = 'REJECTED',
        rejected_at = NOW()
      WHERE application_id = $1
      `,
      [applicationId]
    );

    res.json({ message: "Church application rejected" });
  } catch (error) {
    console.error("Reject error:", error.message);
    res.status(500).json({ message: "Failed to reject church" });
  }
};

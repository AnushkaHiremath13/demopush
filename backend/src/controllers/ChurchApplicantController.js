const pool = require("../config/db");

/* ================= GET ALL PENDING APPLICATIONS ================= */
async function getChurchApplicants(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        application_id,
        ccode,
        cname,
        cemail,
        cdenomination,
        ccity,
        cstate,
        ccountry,
        application_status,
        applied_on
      FROM tblchurch_applicants
      WHERE application_status = 'PENDING'
    `);

    return res.status(200).json({
      success: true,
      applications: result.rows,
    });
  } catch (error) {
    console.error("❌ getChurchApplicants error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch church applications",
    });
  }
}


/* ================= GET SINGLE APPLICATION ================= */
async function getChurchApplicantById(req, res) {
  try {
    const { applicationId } = req.params;

    const result = await pool.query(
      `SELECT * FROM tblchurch_applicants WHERE application_id = $1`,
      [applicationId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      success: true,
      application: result.rows[0],
    });
  } catch (error) {
    console.error("❌ getChurchApplicantById error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch application",
    });
  }
}

/* ================= CREATE APPLICATION ================= */
async function createChurchApplicant(req, res) {
  try {
    let {
      ccode,
      cname,
      cemail,
      cdenomination,
      caddress,
      ccity,
      cstate,
      ccountry,
      cpincode,
      ctimezone,
    } = req.body;

    // ✅ FORCE UPPERCASE (FINAL AUTHORITY)
    ccode = ccode.toUpperCase();

    // ✅ OPTIONAL VALIDATION (recommended)
    if (!/^[A-Z0-9]{2,10}$/.test(ccode)) {
      return res.status(400).json({
        message: "Invalid church code format",
      });
    }

    await pool.query(
      `
      INSERT INTO tblchurch_applicants (
        application_id,
        ccode,
        cname,
        cemail,
        cdenomination,
        caddress,
        ccity,
        cstate,
        ccountry,
        cpincode,
        ctimezone,
        application_status,
        applied_on
      )
      VALUES (
        gen_random_uuid(),
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        'PENDING',
        CURRENT_DATE
      )
      `,
      [
        ccode,
        cname,
        cemail,
        cdenomination,
        caddress,
        ccity,
        cstate,
        ccountry,
        cpincode,
        ctimezone,
      ]
    );

    return res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("❌ createChurchApplicant error:", error.message);
    return res.status(500).json({
      message: "Failed to create application",
    });
  }
}

/* ================= APPROVE APPLICATION ================= */
async function approveChurchApplicant(req, res) {
  const client = await pool.connect();
  const { applicationId } = req.params;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT * FROM tblchurch_applicants WHERE application_id = $1`,
      [applicationId]
    );

    if (!rows.length) throw new Error("Application not found");

    const app = rows[0];

    await client.query(
      `
      INSERT INTO tblchurch (
        cid,
        ccode,
        cname,
        cemail,
        cdenomination,
        caddress,
        ccity,
        cstate,
        ccountry,
        cpincode,
        ctimezone,
        cstatus,
        approvalstatus,
        createdat
      )
      VALUES (
        gen_random_uuid(),
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        'ACTIVE',
        'APPROVED',
        NOW()
      )
      `,
      [
        app.ccode,
        app.cname,
        app.cemail,
        app.cdenomination,
        app.caddress,
        app.ccity,
        app.cstate,
        app.ccountry,
        app.cpincode,
        app.ctimezone,
      ]
    );

    await client.query(
      `
      UPDATE tblchurch_applicants
      SET application_status = 'APPROVED',
          approved_at = NOW()
      WHERE application_id = $1
      `,
      [applicationId]
    );

    await client.query("COMMIT");

    return res.json({ message: "Church approved successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ approveChurchApplicant error:", error.message);
    return res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
}

/* ================= REJECT APPLICATION ================= */
async function rejectChurchApplicant(req, res) {
  try {
    const { applicationId } = req.params;

    await pool.query(
      `
      UPDATE tblchurch_applicants
      SET application_status = 'REJECTED'
      WHERE application_id = $1
      `,
      [applicationId]
    );

    return res.json({ message: "Application rejected" });
  } catch (error) {
    console.error("❌ rejectChurchApplicant error:", error.message);
    return res.status(500).json({
      message: "Failed to reject application",
    });
  }
}

/* ================= EXPORTS ================= */
module.exports = {
  getChurchApplicants,
  getChurchApplicantById,
  createChurchApplicant,
  approveChurchApplicant,
  rejectChurchApplicant,
};

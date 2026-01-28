const {
  assignChurchAuthority,
  suspendChurch,
  activateChurch,
} = require("../services/PlatformChurchService");

const pool = require("../config/db");


/* ================= GET ALL APPROVED CHURCHES ================= */
async function getAllChurches(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        cid,
        ccode,
        cname,
        cemail,
        ccity,
        cstate,
        ccountry,
        cstatus
      FROM tblchurch
      WHERE approvalstatus = 'APPROVED'
      ORDER BY createdat DESC
    `);

    return res.status(200).json({
      success: true,
      churches: result.rows,
    });
  } catch (error) {
    console.error("GetAllChurches DB error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch churches",
    });
  }
}


/* ================= SUSPEND CHURCH ================= */
async function suspend(req, res) {
  try {
    const { cid } = req.params;

    const church = await suspendChurch({
      cid,
      actionBy: req.user.uid,
    });

    return res.status(200).json({
      message: "Church suspended successfully",
      church,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ================= ACTIVATE CHURCH ================= */
async function activate(req, res) {
  try {
    const { cid } = req.params;

    const church = await activateChurch({
      cid,
      actionBy: req.user.uid,
    });

    return res.status(200).json({
      message: "Church activated successfully",
      church,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ================= ASSIGN CHURCH AUTHORITY ================= */
async function assignAuthority(req, res) {
  try {
    const { cid } = req.params;
    const { uemail } = req.body;

    if (!uemail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const result = await assignChurchAuthority({
      cid,
      uemail,
      platformUid: req.user.uid,
    });

    return res.status(200).json({
      message: "Church authority assigned successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ================= GET CHURCH BY ID ================= */
async function getChurchById(req, res) {
  try {
    const { churchId } = req.params;

    const result = await pool.query(
      `
      SELECT
        cid,
        ccode,
        cname,
        cdenomination,
        cemail,
        caddress,
        ccity,
        cstate,
        ccountry,
        cpincode,
        ctimezone,
        cstatus,
        csubscriptionplan,
        createdat
      FROM tblchurch
      WHERE cid = $1
      `,
      [churchId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Church not found" });
    }

    return res.json({ church: result.rows[0] });
  } catch (err) {
    console.error("Get church error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}



module.exports = {
  assignAuthority,
  getAllChurches,
  suspend,
  activate,
  getChurchById,
};

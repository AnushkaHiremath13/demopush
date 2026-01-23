const {
  registerChurch,
  getPendingChurches,
  approveChurch,
  rejectChurch,
  assignChurchAuthority,
  suspendChurch,
  activateChurch,
} = require("../services/PlatformChurchService");

const pool = require("../config/db");

/* ================= REGISTER CHURCH ================= */
async function register(req, res) {
  try {
    const { ccode, cname, ccity, cstate } = req.body;

    if (!ccode || !cname) {
      return res.status(400).json({
        message: "Church code and church name are required",
      });
    }

    const church = await registerChurch({
      ccode,
      cname,
      ccity,
      cstate,
      createdby: req.user.uid,
    });

    return res.status(201).json({
      message: "Church registered successfully and pending approval",
      church,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

/* ================= GET ALL APPROVED & ACTIVE CHURCHES ================= */
async function getAllChurches(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        cid,
        ccode,
        cname,
        cstatus
      FROM tblchurch
      WHERE approvalstatus = 'APPROVED'
        AND cstatus = 'ACTIVE'
      ORDER BY cid DESC
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

/* ================= GET PENDING CHURCHES ================= */
async function fetchPending(req, res) {
  try {
    const churches = await getPendingChurches();
    return res.status(200).json({ churches });
  } catch (error) {
    console.error("Fetch pending churches error:", error.message);
    return res.status(400).json({ message: error.message });
  }
}

/* ================= APPROVE CHURCH ================= */
async function approve(req, res) {
  try {
    const { cid } = req.params;

    const church = await approveChurch({
      cid,
      approvedby: req.user.uid,
    });

    return res.status(200).json({
      message: "Church approved and activated successfully",
      church,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/* ================= REJECT CHURCH ================= */
async function reject(req, res) {
  try {
    const { cid } = req.params;

    const church = await rejectChurch({
      cid,
      approvedby: req.user.uid,
    });

    return res.status(200).json({
      message: "Church rejected successfully",
      church,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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

module.exports = {
  register,
  fetchPending,
  approve,
  reject,
  assignAuthority,
  getAllChurches,
  suspend,
  activate,
};

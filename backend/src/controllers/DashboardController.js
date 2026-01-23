const pool = require("../config/db");

async function getDashboardStats(req, res) {
  try {
    const totalChurches = await pool.query(
      "SELECT COUNT(*) FROM tblchurch"
    );

    const activeChurches = await pool.query(
      "SELECT COUNT(*) FROM tblchurch WHERE approvalstatus = 'APPROVED' AND cstatus = 'ACTIVE'"
    );

    const pendingChurches = await pool.query(
      "SELECT COUNT(*) FROM tblchurch WHERE approvalstatus = 'PENDING'"
    );

    const totalUsers = await pool.query(
      "SELECT COUNT(*) FROM tbluser1"
    );

    return res.status(200).json({
      totalchurches: Number(totalChurches.rows[0].count),
      activechurches: Number(activeChurches.rows[0].count),
      pendingchurches: Number(pendingChurches.rows[0].count),
      totalusers: Number(totalUsers.rows[0].count),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
}

module.exports = { getDashboardStats };

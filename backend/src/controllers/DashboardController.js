// src/controllers/DashboardController.js

const prisma = require("../config/prisma");

/* ============================================================
   DASHBOARD STATS
============================================================ */

async function getDashboardStats(req, res) {
  try {
    const [
      totalChurches,
      activeChurches,
      pendingChurches,
      totalUsers,
    ] = await Promise.all([
      prisma.tblchurch.count(),
      prisma.tblchurch.count({
        where: {
          approvalstatus: "APPROVED",
          cstatus: "ACTIVE",
        },
      }),
      prisma.tblchurch.count({
        where: {
          approvalstatus: "PENDING",
        },
      }),
      prisma.tbluser1.count(),
    ]);

    return res.status(200).json({
      success: true,
      totalchurches: totalChurches,
      activechurches: activeChurches,
      pendingchurches: pendingChurches,
      totalusers: totalUsers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getDashboardStats,
};

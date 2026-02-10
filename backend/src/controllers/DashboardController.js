// src/controllers/DashboardController.js

const {
  getPlatformDashboardStats,
} = require("../services/DashboardService");

/* ============================================================
   PLATFORM DASHBOARD STATS
============================================================ */

async function getDashboardStats(req, res) {
  try {
    const stats = await getPlatformDashboardStats();

    return res.status(200).json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
}

module.exports = {
  getDashboardStats,
};

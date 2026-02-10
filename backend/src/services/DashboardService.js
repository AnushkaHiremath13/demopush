// src/services/DashboardService.js

const prisma = require("../config/prisma");

/* ============================================================
   PLATFORM DASHBOARD STATS SERVICE
============================================================ */

async function getPlatformDashboardStats(platformAdminId = null) {
  try {
    const [
      totalChurches,
      activeChurches,
      pendingApplications,
      totalUsers,
    ] = await prisma.$transaction([
      // Total churches
      prisma.tbl_church.count(),

      // Approved churches
      prisma.tbl_church.count({
        where: {
          chr_approval_status: "APPROVED",
        },
      }),

      // Pending church applications
      prisma.tbl_church_applicants.count({
        where: {
          chr_app_status: "PENDING",
        },
      }),

      // Total community users
      prisma.tbl_user_1.count(),
    ]);

    /* ============================================================
       AUDIT LOG (DASHBOARD VIEW)
       NOTE: Use synthetic UUID, NOT null
    ============================================================ */

    await prisma.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        adt_entity_type: "DASHBOARD",
        adt_entity_id: crypto.randomUUID(),
        adt_action: "VIEW",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
      },
    });

    return {
      totalChurches,
      activeChurches,
      pendingApplications,
      totalUsers,
    };
  } catch (error) {
    console.error("❌ DashboardService error:", error.message);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

module.exports = {
  getPlatformDashboardStats,
};

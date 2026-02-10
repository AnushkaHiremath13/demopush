// src/controllers/SecurityLogController.js

const prisma = require("../config/prisma");

/* ============================================================
   GET SECURITY / AUDIT LOGS (PLATFORM ONLY)
============================================================ */

async function getSecurityLogs(req, res) {
  try {
    // Pagination
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;

    // Optional filters
    const { tenant_scope, chr_id, action } = req.query;

    const where = {};

    if (tenant_scope) where.adt_tenant_scope = tenant_scope;
    if (chr_id) where.chr_id = chr_id;
    if (action) where.adt_action = action;

    const [logs, total] = await prisma.$transaction([
      prisma.tbl_audit.findMany({
        where,
        orderBy: {
          adt_created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.tbl_audit.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      logs,
    });
  } catch (error) {
    console.error("❌ getSecurityLogs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch security logs",
    });
  }
}

module.exports = {
  getSecurityLogs,
};

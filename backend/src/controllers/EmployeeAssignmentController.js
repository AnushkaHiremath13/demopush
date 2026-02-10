// src/controllers/EmployeeAssignmentController.js

const fs = require("fs");
const csv = require("csv-parser");
const prisma = require("../config/prisma");

/* ============================================================
   BULK ASSIGN EMPLOYEES (CSV)
   Scope: COMMUNITY (CHURCH ADMIN)
============================================================ */

async function bulkAssignEmployees(req, res) {
  const adminUsrId = req.user.usr_id;
  const { chr_id } = req.params;

  if (!chr_id) {
    return res.status(400).json({
      success: false,
      message: "Church ID is required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "CSV file is required",
    });
  }

  const rows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      if (row.email) {
        rows.push(row.email.trim().toLowerCase());
      }
    })
    .on("error", () => {
      cleanup(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid CSV file",
      });
    })
    .on("end", async () => {
      cleanup(req.file.path);

      if (!rows.length) {
        return res.status(400).json({
          success: false,
          message: "CSV file contains no valid emails",
        });
      }

      try {
        const result = await prisma.$transaction(async (tx) => {
          /* 1️⃣ Verify admin permission */
          const adminRole = await tx.tbl_church_user.findFirst({
            where: {
              chr_id,
              usr_id: adminUsrId,
              chr_usr_status: "ACTIVE",
              role: {
                role_code: "ADMIN",
              },
            },
            include: { role: true },
          });

          if (!adminRole) {
            throw new Error("Not authorized to assign employees");
          }

          /* 2️⃣ Get EMPLOYEE role */
          const employeeRole = await tx.tbl_role_master.findUnique({
            where: { role_code: "EMPLOYEE" },
          });

          if (!employeeRole) {
            throw new Error("EMPLOYEE role not configured");
          }

          let assigned = 0;
          let skipped = 0;

          for (const email of rows) {
            const user = await tx.tbl_user_1.findUnique({
              where: { usr_email: email },
            });

            if (!user) {
              skipped++;
              continue;
            }

            try {
              await tx.tbl_church_user.create({
                data: {
                  chr_id,
                  usr_id: user.usr_id,
                  role_id: employeeRole.role_id,
                  chr_usr_status: "ACTIVE",
                  chr_usr_created_by: adminUsrId,
                },
              });

              assigned++;
            } catch {
              skipped++;
            }
          }

          /* 3️⃣ Audit */
          await tx.tbl_audit.create({
            data: {
              adt_tenant_scope: "CHURCH",
              chr_id,
              adt_entity_type: "CHURCH_USER",
              adt_entity_id: crypto.randomUUID(),
              adt_action: "BULK_ASSIGN_EMPLOYEE",
              adt_actor_usr_id: adminUsrId,
              adt_actor_context: "CHURCH_ADMIN",
              adt_new_data: {
                assigned,
                skipped,
              },
            },
          });

          return { assigned, skipped };
        });

        return res.status(200).json({
          success: true,
          message: "Employee assignment completed",
          ...result,
        });
      } catch (err) {
        console.error("❌ bulkAssignEmployees:", err.message);
        return res.status(403).json({
          success: false,
          message: err.message,
        });
      }
    });
}

/* ============================================================
   GET EMPLOYEES FOR A CHURCH
============================================================ */

async function getEmployeeAssignments(req, res) {
  const { chr_id } = req.params;
  const adminUsrId = req.user.usr_id;

  try {
    const adminRole = await prisma.tbl_church_user.findFirst({
      where: {
        chr_id,
        usr_id: adminUsrId,
        chr_usr_status: "ACTIVE",
        role: {
          role_code: {
            in: ["ADMIN", "EMPLOYEE"],
          },
        },
      },
      include: { role: true },
    });

    if (!adminRole) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view employees",
      });
    }

    const employees = await prisma.tbl_church_user.findMany({
      where: {
        chr_id,
        role: {
          role_code: "EMPLOYEE",
        },
      },
      include: {
        user: {
          select: {
            usr_id: true,
            usr_name: true,
            usr_email: true,
          },
        },
      },
      orderBy: {
        chr_usr_created_at: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      employees: employees.map((e) => ({
        usr_id: e.user.usr_id,
        name: e.user.usr_name,
        email: e.user.usr_email,
        assigned_at: e.chr_usr_created_at,
      })),
    });
  } catch (err) {
    console.error("❌ getEmployeeAssignments:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
}

/* ============================================================
   HELPERS
============================================================ */

function cleanup(path) {
  try {
    fs.unlinkSync(path);
  } catch {}
}

module.exports = {
  bulkAssignEmployees,
  getEmployeeAssignments,
};

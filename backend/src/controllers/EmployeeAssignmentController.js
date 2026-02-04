const fs = require("fs");
const csv = require("csv-parser");
const prisma = require("../config/prisma");

/* ================= BULK ASSIGN EMPLOYEES ================= */

exports.bulkAssignEmployees = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required" });
  }

  const records = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const { email, phone, ccode } = row;
      if (email && phone && ccode) {
        records.push({
          email: email.trim(),
          phone: phone.trim(),
          ccode: ccode.trim(),
        });
      }
    })
    .on("end", async () => {
      try {
        const result = await prisma.employee_assignments.createMany({
          data: records,
          skipDuplicates: true, // 🔥 THIS LINE
        });

        fs.unlinkSync(req.file.path);

        return res.json({
          inserted: result.count,
          duplicates: records.length - result.count,
        });
      } catch (err) {
        console.error("Bulk insert failed:", err);
        return res.status(500).json({ message: "Bulk insert failed" });
      }
    });
};


/* ================= GET EMPLOYEE ASSIGNMENTS ================= */

exports.getEmployeeAssignments = async (req, res) => {
  try {
    const assignments = await prisma.employee_assignments.findMany({
      orderBy: { createdat: "desc" },
    });

    return res.json({ assignments });
  } catch (err) {
    console.error("Fetch assignments failed:", err);
    return res.status(500).json({
      message: "Failed to fetch assignments",
      error: err.message,
    });
  }
};
// src/controllers/ChurchApplicantController.js
const prisma = require("../config/prisma");

/* ================= GET ALL PENDING APPLICATIONS ================= */

async function getChurchApplicants(req, res) {
  try {
    const applications = await prisma.tblchurch_applicants.findMany({
      where: {
        application_status: "PENDING",
      },
      orderBy: {
        applied_on: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("❌ getChurchApplicants error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch church applicants",
    });
  }
}

/* ================= GET SINGLE APPLICATION ================= */

async function getChurchApplicantById(req, res) {
  try {
    const { applicationId } = req.params;

    const application = await prisma.tblchurch_applicants.findUnique({
      where: {
        application_id: applicationId,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
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

    ccode = ccode.toUpperCase();

    if (!/^[A-Z0-9]{2,10}$/.test(ccode)) {
      return res.status(400).json({
        message: "Invalid church code format",
      });
    }

    // ✅ DUPLICATE CHECK
    const existing = await prisma.tblchurch_applicants.findUnique({
      where: { ccode },
    });

    if (existing) {
      return res.status(400).json({
        message: "Church code already applied",
      });
    }

    await prisma.tblchurch_applicants.create({
      data: {
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
        application_status: "PENDING",
        applied_on: new Date(),
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("❌ createChurchApplicant error:", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}


/* ================= APPROVE APPLICATION (TRANSACTION) ================= */

async function approveChurchApplicant(req, res) {
  const { applicationId } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      const app = await tx.tblchurch_applicants.findUnique({
        where: { application_id: applicationId },
      });

      if (!app) {
        throw new Error("Application not found");
      }

      await tx.tblchurch.create({
        data: {
          ccode: app.ccode,
          cname: app.cname,
          cemail: app.cemail,
          cdenomination: app.cdenomination,
          caddress: app.caddress,
          ccity: app.ccity,
          cstate: app.cstate,
          ccountry: app.ccountry,
          cpincode: app.cpincode,
          ctimezone: app.ctimezone,
          cstatus: "ACTIVE",
          approvalstatus: "APPROVED",
          createdat: new Date(),
        },
      });

      await tx.tblchurch_applicants.update({
        where: { application_id: applicationId },
        data: {
          application_status: "APPROVED",
          approved_at: new Date(),
        },
      });
    });

    return res.json({ message: "Church approved successfully" });
  } catch (error) {
    console.error("❌ approveChurchApplicant error:", error.message);
    return res.status(500).json({ message: error.message });
  }
}

/* ================= REJECT APPLICATION ================= */

async function rejectChurchApplicant(req, res) {
  try {
    const { applicationId } = req.params;

    await prisma.tblchurch_applicants.update({
      where: { application_id: applicationId },
      data: {
        application_status: "REJECTED",
      },
    });

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

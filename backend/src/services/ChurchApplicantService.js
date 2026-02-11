// src/services/ChurchApplicantService.js

const prisma = require("../config/prisma");

/* ============================================================
   FETCH ALL PENDING CHURCH APPLICATIONS (PLATFORM)
============================================================ */

async function getPendingApplications() {
  return prisma.tbl_church_applicants.findMany({
    where: {
      chr_app_status: "PENDING",
    },
    orderBy: {
      chr_app_applied_on: "asc",
    },
  });
}

/* ============================================================
   FETCH SINGLE APPLICATION BY ID
============================================================ */

async function getApplicationById(applicationId) {
  const application = await prisma.tbl_church_applicants.findUnique({
    where: { chr_app_id: applicationId },
  });

  if (!application) {
    throw new Error("Church application not found");
  }

  return application;
}

/* ============================================================
   CREATE CHURCH APPLICATION (PUBLIC)
============================================================ */

async function createApplication(data) {
  const {
    chr_app_code,
    chr_app_name,
    chr_app_email,
    chr_app_denomination,
    chr_app_location,
    chr_app_timezone,
    chr_app_city,
    chr_app_state,
    chr_app_country,
    chr_app_pincode,
  } = data;

  if (!chr_app_code || !chr_app_name) {
    throw new Error("Church code and name are required");
  }

  const code = chr_app_code.toUpperCase();
  const normalizedEmail = chr_app_email
    ? chr_app_email.toLowerCase()
    : null;

  const existingApp = await prisma.tbl_church_applicants.findFirst({
    where: { chr_app_code: code },
  });

  if (existingApp) {
    throw new Error("Church code already applied");
  }

  const existingChurch = await prisma.tbl_church.findUnique({
    where: { chr_code: code },
  });

  if (existingChurch) {
    throw new Error("Church already exists");
  }

  const application = await prisma.tbl_church_applicants.create({
    data: {
      chr_app_code: code,
      chr_app_name,
      chr_app_email: normalizedEmail,
      chr_app_denomination,
      chr_app_location,
      chr_app_address: chr_app_location || null, // ✅ use location as address
      chr_app_timezone,
      chr_app_city,
      chr_app_state,
      chr_app_country,
      chr_app_pincode,
      chr_app_status: "PENDING",
    },
  });

  return application;
}


/* ============================================================
   APPROVE CHURCH APPLICATION (PLATFORM)
============================================================ */
async function approveApplication(applicationId, platformAdminId) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.tbl_church_applicants.findUnique({
      where: { chr_app_id: applicationId },
    });

    if (!application || application.chr_app_status !== "PENDING") {
      throw new Error("Application not found or already processed");
    }

    const existingChurch = await tx.tbl_church.findUnique({
      where: { chr_code: application.chr_app_code },
    });

    if (existingChurch) {
      throw new Error("Church already exists");
    }

    const church = await tx.tbl_church.create({
      data: {
        chr_code: application.chr_app_code,
        chr_name: application.chr_app_name,
        chr_email: application.chr_app_email,
        chr_denomination: application.chr_app_denomination,
        chr_location: application.chr_app_location,
        chr_address: application.chr_app_address, // ✅ FIXED
        chr_timezone: application.chr_app_timezone,
        chr_city: application.chr_app_city,
        chr_state: application.chr_app_state,
        chr_country: application.chr_app_country,
        chr_pincode: application.chr_app_pincode,
        chr_approval_status: "APPROVED",
        chr_approved_by: platformAdminId,
        chr_approved_at: new Date(),
      },
    });

    await tx.tbl_church_applicants.update({
      where: { chr_app_id: applicationId },
      data: {
        chr_app_status: "APPROVED",
        chr_app_approved_by: platformAdminId,
        chr_app_approved_at: new Date(),
      },
    });

    return church;
  });
}


/* ============================================================
   REJECT CHURCH APPLICATION (PLATFORM)
============================================================ */

async function rejectApplication(applicationId, platformAdminId) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.tbl_church_applicants.findUnique({
      where: { chr_app_id: applicationId },
    });

    if (!application || application.chr_app_status !== "PENDING") {
      throw new Error("Application not found or already processed");
    }

    await tx.tbl_church_applicants.update({
      where: { chr_app_id: applicationId },
      data: {
        chr_app_status: "REJECTED",
        chr_app_approved_by: platformAdminId,
        chr_app_approved_at: new Date(),
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        adt_entity_type: "CHURCH_APPLICATION",
        adt_entity_id: applicationId,
        adt_action: "REJECT",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
      },
    });

    return { message: "Church application rejected successfully" };
  });
}

module.exports = {
  getPendingApplications,
  getApplicationById,
  createApplication,
  approveApplication,
  rejectApplication,
};

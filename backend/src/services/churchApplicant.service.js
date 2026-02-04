// src/services/churchApplicant.service.js

const prisma = require("../config/prisma");

/* ============================================================
   FETCH PENDING APPLICANTS
============================================================ */

async function fetchApplicants() {
  const applicants = await prisma.tblchurch_applicants.findMany({
    where: {
      application_status: "PENDING",
    },
    orderBy: {
      applied_on: "asc",
    },
  });

  return applicants;
}

/* ============================================================
   APPROVE APPLICANT
============================================================ */

async function approveApplicant(applicationId, approvedBy) {
  return await prisma.$transaction(async (tx) => {
    /* 1️⃣ Fetch applicant (must be pending) */
    const applicant = await tx.tblchurch_applicants.findFirst({
      where: {
        application_id: applicationId,
        application_status: "PENDING",
      },
    });

    if (!applicant) {
      throw new Error("Applicant not found or already processed");
    }

    /* 2️⃣ Insert into tblchurch */
    await tx.tblchurch.create({
      data: {
        ccode: applicant.ccode,
        cname: applicant.cname,
        caddress: applicant.caddress,
        ccity: applicant.ccity,
        cstate: applicant.cstate,
        ccountry: applicant.ccountry,
        cpincode: applicant.cpincode,
        cdenomination: applicant.cdenomination,
        clocation: applicant.clocation,
        ctimezone: applicant.ctimezone,
        approvedby: approvedBy,
      },
    });

    /* 3️⃣ Update applicant status */
    await tx.tblchurch_applicants.update({
      where: {
        application_id: applicationId,
      },
      data: {
        application_status: "APPROVED",
      },
    });

    return {
      message: "Church application approved successfully",
    };
  });
}

/* ============================================================
   REJECT APPLICANT
============================================================ */

async function rejectApplicant(applicationId) {
  const result = await prisma.tblchurch_applicants.updateMany({
    where: {
      application_id: applicationId,
      application_status: "PENDING",
    },
    data: {
      application_status: "REJECTED",
    },
  });

  if (result.count === 0) {
    throw new Error("Applicant not found or already processed");
  }

  return {
    message: "Church application rejected successfully",
  };
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  fetchApplicants,
  approveApplicant,
  rejectApplicant,
};

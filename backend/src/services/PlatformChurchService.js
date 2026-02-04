// src/services/PlatformChurchService.js

const prisma = require("../config/prisma");
const { v7: uuidv7 } = require("uuid");

/* ============================================================
   REGISTER CHURCH
   RULE:
   - approvalstatus = PENDING
   - cstatus = INACTIVE
============================================================ */

async function registerChurch({ ccode, cname, ccity, cstate, createdby }) {
  const church = await prisma.tblchurch.create({
    data: {
      cid: uuidv7(),
      ccode,
      cname,
      ccity: ccity || null,
      cstate: cstate || null,
      approvalstatus: "PENDING",
      cstatus: "INACTIVE",
      createdby,
      createdat: new Date(),
    },
  });

  return church;
}

/* ============================================================
   GET PENDING CHURCHES
============================================================ */

async function getPendingChurches() {
  const churches = await prisma.tblchurch.findMany({
    where: {
      approvalstatus: "PENDING",
    },
    select: {
      cid: true,
      ccode: true,
      cname: true,
      ccity: true,
      cstate: true,
      createdat: true,
    },
    orderBy: {
      createdat: "desc",
    },
  });

  return churches;
}

/* ============================================================
   SUSPEND CHURCH
============================================================ */

async function suspendChurch({ cid }) {
  const result = await prisma.tblchurch.updateMany({
    where: {
      cid,
      approvalstatus: "APPROVED",
    },
    data: {
      cstatus: "SUSPENDED",
    },
  });

  if (result.count === 0) {
    throw new Error("Church not found or not approved");
  }

  return { cid, status: "SUSPENDED" };
}

/* ============================================================
   ACTIVATE CHURCH
============================================================ */

async function activateChurch({ cid }) {
  const result = await prisma.tblchurch.updateMany({
    where: {
      cid,
      approvalstatus: "APPROVED",
    },
    data: {
      cstatus: "ACTIVE",
    },
  });

  if (result.count === 0) {
    throw new Error("Church not found or not approved");
  }

  return { cid, status: "ACTIVE" };
}

/* ============================================================
   APPROVE CHURCH
   RULE:
   - approvalstatus = APPROVED
   - cstatus = ACTIVE
============================================================ */

async function approveChurch({ cid, approvedby }) {
  const result = await prisma.tblchurch.updateMany({
    where: {
      cid,
      approvalstatus: "PENDING",
    },
    data: {
      approvalstatus: "APPROVED",
      approvedby,
      approvedat: new Date(),
      cstatus: "ACTIVE",
    },
  });

  if (result.count === 0) {
    throw new Error("Church not found or already processed");
  }

  return { cid, approvalstatus: "APPROVED" };
}

/* ============================================================
   REJECT CHURCH
   RULE:
   - approvalstatus = REJECTED
   - cstatus = INACTIVE
============================================================ */

async function rejectChurch({ cid, approvedby }) {
  const result = await prisma.tblchurch.updateMany({
    where: {
      cid,
    },
    data: {
      approvalstatus: "REJECTED",
      cstatus: "INACTIVE",
      approvedby,
      approvedat: new Date(),
    },
  });

  if (result.count === 0) {
    throw new Error("Church not found");
  }

  return { cid, approvalstatus: "REJECTED" };
}

/* ============================================================
   ASSIGN CHURCH AUTHORITY
   (Logic intentionally unchanged – placeholder)
============================================================ */

async function assignChurchAuthority({ cid, uemail, platformUid }) {
  // You said: "Implementation depends on your user/church-user table"
  // So we keep it unchanged and safe

  return {
    cid,
    uemail,
    assignedBy: platformUid,
  };
}

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  registerChurch,
  getPendingChurches,
  approveChurch,
  rejectChurch,
  assignChurchAuthority,
  suspendChurch,
  activateChurch,
};

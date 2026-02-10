// src/services/ChurchFollowerService.js

const prisma = require("../config/prisma");

/* ============================================================
   VERIFY CHURCH ADMIN PRIVILEGE
============================================================ */

async function assertChurchAdmin(chr_id, adminUsrId) {
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
    include: {
      role: true,
    },
  });

  if (!adminRole) {
    throw new Error("Not authorized to manage followers for this church");
  }
}

/* ============================================================
   GET PENDING FOLLOWERS
============================================================ */

async function getPendingFollowers(chr_id, adminUsrId) {
  await assertChurchAdmin(chr_id, adminUsrId);

  const followers = await prisma.tbl_church_user.findMany({
    where: {
      chr_id,
      chr_usr_status: "PENDING",
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
      chr_usr_created_at: "asc",
    },
  });

  return followers.map((f) => ({
    usr_id: f.user.usr_id,
    usr_name: f.user.usr_name,
    usr_email: f.user.usr_email,
    requested_at: f.chr_usr_created_at,
  }));
}

/* ============================================================
   APPROVE FOLLOWER
============================================================ */

async function approveFollower(chr_id, usr_id, adminUsrId) {
  return prisma.$transaction(async (tx) => {
    await assertChurchAdmin(chr_id, adminUsrId);

    const record = await tx.tbl_church_user.findFirst({
      where: {
        chr_id,
        usr_id,
        chr_usr_status: "PENDING",
      },
    });

    if (!record) {
      throw new Error("Follower not found or already processed");
    }

    await tx.tbl_church_user.update({
      where: { chr_usr_id: record.chr_usr_id },
      data: {
        chr_usr_status: "ACTIVE",
        chr_usr_created_by: adminUsrId,
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "CHURCH",
        chr_id,
        adt_entity_type: "CHURCH_USER",
        adt_entity_id: usr_id,
        adt_action: "APPROVE_FOLLOWER",
        adt_actor_usr_id: adminUsrId,
        adt_actor_context: "CHURCH_ADMIN",
      },
    });
  });
}

/* ============================================================
   REJECT FOLLOWER
============================================================ */

async function rejectFollower(chr_id, usr_id, adminUsrId) {
  return prisma.$transaction(async (tx) => {
    await assertChurchAdmin(chr_id, adminUsrId);

    const record = await tx.tbl_church_user.findFirst({
      where: {
        chr_id,
        usr_id,
        chr_usr_status: "PENDING",
      },
    });

    if (!record) {
      throw new Error("Follower not found or already processed");
    }

    await tx.tbl_church_user.update({
      where: { chr_usr_id: record.chr_usr_id },
      data: {
        chr_usr_status: "REJECTED",
        chr_usr_created_by: adminUsrId,
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "CHURCH",
        chr_id,
        adt_entity_type: "CHURCH_USER",
        adt_entity_id: usr_id,
        adt_action: "REJECT_FOLLOWER",
        adt_actor_usr_id: adminUsrId,
        adt_actor_context: "CHURCH_ADMIN",
      },
    });
  });
}

module.exports = {
  getPendingFollowers,
  approveFollower,
  rejectFollower,
};

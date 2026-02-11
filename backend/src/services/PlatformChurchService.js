// src/services/PlatformChurchService.js

const prisma = require("../config/prisma");
const crypto = require("crypto");

/* ============================================================
   GET ALL CHURCHES (PLATFORM)
============================================================ */

async function getAllChurches() {
  const churches = await prisma.tbl_church.findMany({
    select: {
      chr_id: true,
      chr_code: true,
      chr_name: true,
      chr_email: true,
      chr_city: true,
      chr_state: true,
      chr_country: true,
      chr_approval_status: true,
      chr_created_at: true,
    },
    orderBy: {
      chr_created_at: "desc",
    },
  });

  await prisma.tbl_audit.create({
    data: {
      adt_tenant_scope: "PLATFORM",
      adt_entity_type: "CHURCH",
      adt_entity_id: crypto.randomUUID(),
      adt_action: "VIEW_ALL",
      adt_actor_context: "PLATFORM",
    },
  });

  return churches;
}

/* ============================================================
   GET CHURCH BY ID
============================================================ */

async function getChurchById(churchId) {
  const church = await prisma.tbl_church.findUnique({
    where: { chr_id: churchId },
  });

  if (!church) {
    throw new Error("Church not found");
  }

  return church;
}

/* ============================================================
   SUSPEND CHURCH
============================================================ */

async function suspendChurch(churchId, platformAdminId) {
  if (!platformAdminId) {
    throw new Error("Platform admin ID is required");
  }

  return prisma.$transaction(async (tx) => {
    const church = await tx.tbl_church.findUnique({
      where: { chr_id: churchId },
    });

    if (!church) {
      throw new Error("Church not found");
    }

    if (church.chr_approval_status !== "APPROVED") {
      throw new Error("Only approved churches can be suspended");
    }

    await tx.tbl_church.update({
      where: { chr_id: churchId },
      data: {
        chr_approval_status: "SUSPENDED",
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        chr_id: churchId,
        adt_entity_type: "CHURCH",
        adt_entity_id: churchId,
        adt_action: "SUSPEND",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
      },
    });

    return { message: "Church suspended successfully" };
  });
}

/* ============================================================
   ACTIVATE CHURCH
============================================================ */

async function activateChurch(churchId, platformAdminId) {
  if (!platformAdminId) {
    throw new Error("Platform admin ID is required");
  }

  return prisma.$transaction(async (tx) => {
    const church = await tx.tbl_church.findUnique({
      where: { chr_id: churchId },
    });

    if (!church) {
      throw new Error("Church not found");
    }

    if (church.chr_approval_status !== "SUSPENDED") {
      throw new Error("Only suspended churches can be activated");
    }

    await tx.tbl_church.update({
      where: { chr_id: churchId },
      data: {
        chr_approval_status: "APPROVED",
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        chr_id: churchId,
        adt_entity_type: "CHURCH",
        adt_entity_id: churchId,
        adt_action: "ACTIVATE",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
      },
    });

    return { message: "Church activated successfully" };
  });
}

/* ============================================================
   ASSIGN CHURCH AUTHORITY
============================================================ */

async function assignChurchAuthority({ churchId, email, platformAdminId }) {
  if (!platformAdminId) {
    throw new Error("Platform admin ID is required");
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.tbl_user_1.findUnique({
      where: { usr_email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const role = await tx.tbl_role_master.findUnique({
      where: { role_code: "ADMIN" },
    });

    if (!role) {
      throw new Error("ADMIN role not configured");
    }

    const church = await tx.tbl_church.findUnique({
      where: { chr_id: churchId },
    });

    if (!church || church.chr_approval_status !== "APPROVED") {
      throw new Error("Church not found or not approved");
    }

    await tx.tbl_church_user.upsert({
      where: {
        chr_id_usr_id_role_id: {
          chr_id: churchId,
          usr_id: user.usr_id,
          role_id: role.role_id,
        },
      },
      update: {
        chr_usr_status: "ACTIVE",
      },
      create: {
        chr_id: churchId,
        usr_id: user.usr_id,
        role_id: role.role_id,
        chr_usr_status: "ACTIVE",
        chr_usr_created_by: platformAdminId,
      },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        chr_id: churchId,
        adt_entity_type: "CHURCH_USER",
        adt_entity_id: user.usr_id,
        adt_action: "ASSIGN_ADMIN",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
        adt_new_data: {
          email,
          role: "ADMIN",
        },
      },
    });

    return {
      churchId,
      userEmail: email,
      role: "ADMIN",
    };
  });
}

module.exports = {
  getAllChurches,
  getChurchById,
  suspendChurch,
  activateChurch,
  assignChurchAuthority,
};

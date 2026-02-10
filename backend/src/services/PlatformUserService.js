// src/services/PlatformUserService.js

const prisma = require("../config/prisma");
const crypto = require("crypto");

/* ============================================================
   GET ALL COMMUNITY USERS (PLATFORM)
============================================================ */

async function getAllPlatformUsers() {
  const users = await prisma.tbl_user_1.findMany({
    select: {
      usr_id: true,
      usr_name: true,
      usr_email: true,
      usr_phone: true,
      usr_status: true,
      usr_created_at: true,
    },
    orderBy: {
      usr_created_at: "desc",
    },
  });

  // Audit (list view → synthetic UUID)
  await prisma.tbl_audit.create({
    data: {
      adt_tenant_scope: "PLATFORM",
      adt_entity_type: "USER",
      adt_entity_id: crypto.randomUUID(),
      adt_action: "VIEW_ALL",
      adt_actor_context: "PLATFORM",
    },
  });

  return users;
}

/* ============================================================
   BLOCK USER (PLATFORM)
============================================================ */

async function blockUser(userId, platformAdminId) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.tbl_user_1.findUnique({
      where: { usr_id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.usr_status === "BLOCKED") {
      throw new Error("User is already blocked");
    }

    // Safety: ensure this is not a platform account
    const platformAccount = await tx.tbl_platform_1.findFirst({
      where: { plt_email: user.usr_email },
    });

    if (platformAccount) {
      throw new Error("Platform users cannot be blocked");
    }

    await tx.tbl_user_1.update({
      where: { usr_id: userId },
      data: { usr_status: "BLOCKED" },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        adt_entity_type: "USER",
        adt_entity_id: userId,
        adt_action: "BLOCK",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
        adt_new_data: {
          status: "BLOCKED",
        },
      },
    });
  });
}

/* ============================================================
   UNBLOCK USER (PLATFORM)
============================================================ */

async function unblockUser(userId, platformAdminId) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.tbl_user_1.findUnique({
      where: { usr_id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.usr_status === "ACTIVE") {
      throw new Error("User is already active");
    }

    await tx.tbl_user_1.update({
      where: { usr_id: userId },
      data: { usr_status: "ACTIVE" },
    });

    await tx.tbl_audit.create({
      data: {
        adt_tenant_scope: "PLATFORM",
        adt_entity_type: "USER",
        adt_entity_id: userId,
        adt_action: "UNBLOCK",
        adt_actor_usr_id: platformAdminId,
        adt_actor_context: "PLATFORM",
        adt_new_data: {
          status: "ACTIVE",
        },
      },
    });
  });
}

module.exports = {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
};

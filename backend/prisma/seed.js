// prisma/seed.js

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  /* =====================================================
     1️⃣ ROLE MASTER
  ===================================================== */

  const roles = [
    { role_code: "FOLLOWER", role_desc: "Default follower role" },
    { role_code: "EMPLOYEE", role_desc: "Church employee" },
    { role_code: "CHURCH_ADMIN", role_desc: "Church administrator" },
    { role_code: "PLATFORM_ADMIN", role_desc: "Platform super administrator" },
  ];

  for (const role of roles) {
    await prisma.tbl_role_master.upsert({
      where: { role_code: role.role_code },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded");

  /* =====================================================
     2️⃣ FETCH PLATFORM_ADMIN ROLE
  ===================================================== */

  const platformAdminRole = await prisma.tbl_role_master.findUnique({
    where: { role_code: "PLATFORM_ADMIN" },
  });

  if (!platformAdminRole) {
    throw new Error("PLATFORM_ADMIN role missing");
  }

  /* =====================================================
     3️⃣ CHECK PLATFORM ADMIN EXISTENCE (BY EMAIL)
  ===================================================== */

  const adminEmail = "admin@platform.com";

  let platformAdmin = await prisma.tbl_platform_1.findUnique({
    where: { plt_email: adminEmail },
  });

  if (platformAdmin) {
    console.log("⚠️ Platform admin already exists. Skipping creation.");
    return;
  }

  /* =====================================================
     4️⃣ CREATE PLATFORM ADMIN
  ===================================================== */

  const hashedPassword = await bcrypt.hash(
    process.env.PLATFORM_ADMIN_PASSWORD || "Platform@123",
    12
  );

  platformAdmin = await prisma.tbl_platform_1.create({
    data: {
      plt_name: "Platform Admin",
      plt_email: adminEmail,
      plt_password: hashedPassword,
      plt_email_verified: true,
      plt_status: "ACTIVE",
    },
  });

  console.log("✅ Platform admin created");

  /* =====================================================
     5️⃣ ASSIGN PLATFORM_ADMIN ROLE
  ===================================================== */

  await prisma.tbl_platform_user.create({
    data: {
      plt_id: platformAdmin.plt_id,
      role_id: platformAdminRole.role_id,
    },
  });

  console.log("✅ PLATFORM_ADMIN role assigned");

  /* =====================================================
     6️⃣ AUDIT LOG
  ===================================================== */

  await prisma.tbl_audit.create({
    data: {
      adt_tenant_scope: "SYSTEM",
      adt_entity_type: "PLATFORM_ADMIN",
      adt_entity_id: platformAdmin.plt_id,
      adt_action: "CREATE",
      adt_actor_context: "SYSTEM",
      adt_new_data: {
        email: adminEmail,
        role: "PLATFORM_ADMIN",
      },
    },
  });

  console.log("📝 Audit log created");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

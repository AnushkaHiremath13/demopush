const bcrypt = require("bcrypt");

async function createPlatformAdminIfNotExists() {
  try {
    // ✅ Import pool lazily (KEY FIX)
    const pool = require("../config/db");

    const check = await pool.query(
      `SELECT uid FROM tbluser1 WHERE uisplatform = true LIMIT 1`
    );

    if (check.rowCount > 0) {
      console.log("✅ Platform admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Platform@powaha6", 10);

    await pool.query(
      `
      INSERT INTO tbluser1 (
        uid,
        uname,
        uemail,
        upassword,
        uisplatform,
        uisemployee,
        uisfollower,
        uemailverified,
        uphoneverified,
        ustatus,
        createdat
      )
      VALUES (
        gen_random_uuid(),
        'Platform Admin',
        'admin@powaha.com',
        $1,
        true,
        false,
        false,
        true,
        true,
        'ACTIVE',
        NOW()
      )
      `,
      [hashedPassword]
    );

    //console.log("🚀 Platform admin bootstrapped successfully");
  } catch (error) {
    console.error("❌ Bootstrap failed:", error.message);
  }
}

module.exports = createPlatformAdminIfNotExists;

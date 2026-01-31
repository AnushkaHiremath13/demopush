require("dotenv").config();

const app = require("./src/app");
const createPlatformAdminIfNotExists =
  require("./src/bootstrap/platformAdmin.bootstrap");

(async () => {
  try {
    await createPlatformAdminIfNotExists();

    const PORT = process.env.PORT || 5000;

    // 🔐 HTTP only — HTTPS handled by Nginx
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();

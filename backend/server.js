const https = require("https");
const fs = require("fs");
const path = require("path");

const app = require("./src/app");
const createPlatformAdminIfNotExists =
  require("./src/bootstrap/platformAdmin.bootstrap");

(async () => {
  try {
    // ✅ Bootstrap platform admin
    await createPlatformAdminIfNotExists();

    const PORT = 5000;

    // ✅ SSL configuration
    const sslOptions = {
      key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
    };

    // ✅ HTTPS server
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`🔐 HTTPS Server running at https://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();

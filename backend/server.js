// server.js

require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
});

/* ============================================================
   GRACEFUL SHUTDOWN (PM2 / VPS SAFE)
============================================================ */

const shutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });

  // Force exit if not closed in time
  setTimeout(() => {
    console.error("❌ Force shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

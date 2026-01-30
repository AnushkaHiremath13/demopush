const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const platformRoutes = require("./routes/platform.routes");
const churchRoutes = require("./routes/church.routes");

const app = express();

/* ================= GLOBAL MIDDLEWARE ================= */

// Body parser
app.use(express.json());

// ✅ CORS (HTTP + HTTPS frontend supported)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/platform", platformRoutes);
app.use("/api/church", churchRoutes);

module.exports = app;

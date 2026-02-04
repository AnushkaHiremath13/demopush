// src/app.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const platformRoutes = require("./routes/platform.routes");
const churchRoutes = require("./routes/church.routes");
const userRoutes = require("./routes/user.routes");


const app = express();

/* ============================================================
   GLOBAL CONFIG
============================================================ */

const API_PREFIX = process.env.API_PREFIX || "/api";

/* ============================================================
   MIDDLEWARE
============================================================ */

app.disable("x-powered-by"); // 🔐 security best practice

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",     // local dev
      "https://powaha.com",        // production
      "https://www.powaha.com",    // production
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ============================================================
   ROUTES
============================================================ */

// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/platform`, platformRoutes);
// app.use(`${API_PREFIX}/church`, churchRoutes);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/platform", platformRoutes);
app.use("/api/church", churchRoutes);

/* ============================================================
   GLOBAL ERROR HANDLER (LAST RESORT)
============================================================ */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* ============================================================
   USER ROUTES
============================================================ */
app.use("/api/user", userRoutes);

module.exports = app;


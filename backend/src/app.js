// src/app.js

const express = require("express");
const cors = require("cors");
const multer = require("multer");
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

app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ============================================================
   ROUTES
============================================================ */

// COMMUNITY AUTH
app.use(`${API_PREFIX}/auth`, authRoutes);

// PLATFORM (login + protected routes)
app.use(`${API_PREFIX}/platform`, platformRoutes);

// COMMUNITY CHURCH ROUTES
app.use(`${API_PREFIX}/church`, churchRoutes);

// COMMUNITY USER ROUTES
app.use(`${API_PREFIX}/user`, userRoutes);

/* ============================================================
   404 HANDLER
============================================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    success: false,
    message:
      status === 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
});

module.exports = app;

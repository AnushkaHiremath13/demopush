const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const platformRoutes = require("./routes/platform.routes");
const churchRoutes = require("./routes/church.routes");

const app = express();

/* ================= GLOBAL CONFIG ================= */

const API_PREFIX = process.env.API_PREFIX || "/api";

/* ================= MIDDLEWARE ================= */

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",     // 🧪 local dev
      "https://powaha.com",        // 🚀 VPS
      "https://www.powaha.com",    // 🚀 VPS
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/*
🧪 LOCAL QUICK FIX (COMMENTED)
app.use(cors());
*/

/* ================= ROUTES ================= */

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/platform`, platformRoutes);
app.use(`${API_PREFIX}/church`, churchRoutes);

module.exports = app;

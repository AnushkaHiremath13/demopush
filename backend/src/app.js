const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const platformRoutes = require("./routes/platform.routes");
const churchRoutes = require("./routes/church.routes");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/platform", platformRoutes); // 👈 PLATFORM ROUTES HERE
app.use("/api/church", churchRoutes);     // 👈 CHURCH ROUTES HERE

module.exports = app;

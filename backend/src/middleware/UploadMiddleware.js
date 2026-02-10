// src/middleware/UploadMiddleware.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ============================================================
   UPLOAD DIRECTORY (VPS SAFE)
============================================================ */

// Prefer env override, fallback to /tmp (safe on Linux VPS)
const uploadBase =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadBase)) {
  fs.mkdirSync(uploadBase, { recursive: true });
}

/* ============================================================
   STORAGE CONFIG
============================================================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadBase);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();

    // Sanitize base name
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9-_]/gi, "_")
      .toLowerCase();

    cb(null, `${base}-${timestamp}-${random}${ext}`);
  },
});

/* ============================================================
   FILE FILTER (STRICT CSV ONLY)
============================================================ */

function csvFileFilter(req, file, cb) {
  const isCsvMime =
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel";

  const isCsvExt = path.extname(file.originalname).toLowerCase() === ".csv";

  if (isCsvMime && isCsvExt) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only CSV files are allowed"
      ),
      false
    );
  }
}

/* ============================================================
   MULTER INSTANCE
============================================================ */

const upload = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

module.exports = upload;

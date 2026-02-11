// src/controllers/PlatformChurchController.js

const {
  getAllChurches,
  getChurchById,
  suspendChurch,
  activateChurch,
  assignChurchAuthority,
} = require("../services/PlatformChurchService");

/* ============================================================
   GET ALL CHURCHES (PLATFORM)
============================================================ */

async function getAllChurchesController(req, res) {
  try {
    const churches = await getAllChurches();

    return res.status(200).json({
      success: true,
      churches,
    });
  } catch (error) {
    console.error("❌ getAllChurches error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch churches",
    });
  }
}

/* ============================================================
   GET CHURCH BY ID (PLATFORM)
============================================================ */

async function getChurchByIdController(req, res) {
  try {
    const { churchId } = req.params;

    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: "Church ID is required",
      });
    }

    const church = await getChurchById(churchId);

    return res.status(200).json({
      success: true,
      church,
    });
  } catch (error) {
    console.error("❌ getChurchById error:", error.message);

    const status =
      error.message.toLowerCase().includes("not found") ? 404 : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   SUSPEND CHURCH (PLATFORM)
============================================================ */

async function suspend(req, res) {
  try {
    const { churchId } = req.params;

    if (!req.user || !req.user.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: "Church ID is required",
      });
    }

    const platformAdminId = req.user.plt_id;

    await suspendChurch(churchId, platformAdminId);

    return res.status(200).json({
      success: true,
      message: "Church suspended successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


/* ============================================================
   ACTIVATE CHURCH (PLATFORM)
============================================================ */

async function activate(req, res) {
  try {
    const { churchId } = req.params;

    if (!req.user || !req.user.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: "Church ID is required",
      });
    }

    const platformAdminId = req.user.plt_id;

    await activateChurch(churchId, platformAdminId);

    return res.status(200).json({
      success: true,
      message: "Church activated successfully",
    });
  } catch (error) {
    const status =
      error.message.toLowerCase().includes("not found")
        ? 404
        : error.message.toLowerCase().includes("authorized")
        ? 403
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   ASSIGN CHURCH AUTHORITY (PLATFORM)
============================================================ */
async function assignAuthority(req, res) {
  try {
    const { churchId } = req.params;
    const { email } = req.body;

    if (!req.user || !req.user.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!churchId || !email) {
      return res.status(400).json({
        success: false,
        message: "Church ID and user email are required",
      });
    }

    const platformAdminId = req.user.plt_id;

    const result = await assignChurchAuthority({
      churchId,
      email,
      platformAdminId,
    });

    return res.status(200).json({
      success: true,
      message: "Church authority assigned successfully",
      data: result,
    });
  } catch (error) {
    const status =
      error.message.toLowerCase().includes("not found")
        ? 404
        : error.message.toLowerCase().includes("authorized")
        ? 403
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getAllChurches: getAllChurchesController,
  getChurchById: getChurchByIdController,
  suspend,
  activate,
  assignAuthority,
};

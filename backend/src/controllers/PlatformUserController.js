// src/controllers/PlatformUserController.js

const {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
} = require("../services/PlatformUserService");

/* ============================================================
   GET ALL PLATFORM USERS
============================================================ */

async function getUsers(req, res) {
  try {
    if (!req.user || !req.user.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    const users = await getAllPlatformUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ getUsers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

/* ============================================================
   BLOCK USER
============================================================ */

async function block(req, res) {
  try {
    const { userId } = req.params;

    if (!req.user || !req.user.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const platformAdminId = req.user.plt_id;

    await blockUser(userId, platformAdminId);

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    console.error("❌ blockUser error:", error.message);

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
   UNBLOCK USER
============================================================ */

async function unblock(req, res) {
  try {
    const { userId } = req.params;

    if (!req.user || !req.user.plt_id) {
      return res.status(403).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const platformAdminId = req.user.plt_id;

    await unblockUser(userId, platformAdminId);

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    console.error("❌ unblockUser error:", error.message);

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
  getUsers,
  block,
  unblock,
};

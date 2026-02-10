// src/controllers/PlatformUserController.js

const {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
} = require("../services/PlatformUserService");

/* ============================================================
   GET ALL COMMUNITY USERS (PLATFORM)
============================================================ */

async function getUsers(req, res) {
  try {
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
   BLOCK USER (PLATFORM)
============================================================ */

async function block(req, res) {
  try {
    const { userId } = req.params;
    const platformAdminId = req.platform.plt_id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

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
        : error.message.toLowerCase().includes("not authorized")
        ? 403
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   UNBLOCK USER (PLATFORM)
============================================================ */

async function unblock(req, res) {
  try {
    const { userId } = req.params;
    const platformAdminId = req.platform.plt_id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

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
        : error.message.toLowerCase().includes("not authorized")
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

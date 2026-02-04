// src/controllers/PlatformUserController.js

const {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
} = require("../services/PlatformUserService");

/* ============================================================
   GET PLATFORM USERS
============================================================ */

async function getUsers(req, res) {
  try {
    const users = await getAllPlatformUsers();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   BLOCK USER
============================================================ */

async function block(req, res) {
  try {
    const { uid } = req.params;
    await blockUser({ uid });
    return res.status(200).json({
      success: true,
      message: "User blocked",
    });
  } catch (error) {
    return res.status(404).json({
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
    const { uid } = req.params;
    await unblockUser({ uid });
    return res.status(200).json({
      success: true,
      message: "User unblocked",
    });
  } catch (error) {
    return res.status(404).json({
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

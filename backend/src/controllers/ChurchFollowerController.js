// src/controllers/ChurchFollowerController.js

const {
  getPendingFollowers,
  approveFollower,
  rejectFollower,
} = require("../services/ChurchFollowerService");

/* ============================================================
   GET PENDING FOLLOWERS (CHURCH ADMIN)
============================================================ */

async function pending(req, res) {
  try {
    const { chr_id } = req.params;
    const adminUsrId = req.user.usr_id;

    if (!chr_id) {
      return res.status(400).json({
        success: false,
        message: "Church ID is required",
      });
    }

    const followers = await getPendingFollowers(chr_id, adminUsrId);

    return res.status(200).json({
      success: true,
      followers,
    });
  } catch (error) {
    console.error("❌ pending followers error:", error.message);

    const status =
      error.message.toLowerCase().includes("not authorized")
        ? 403
        : error.message.toLowerCase().includes("not found")
        ? 404
        : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   APPROVE FOLLOWER
============================================================ */

async function approve(req, res) {
  try {
    const { chr_id, usr_id } = req.params;
    const adminUsrId = req.user.usr_id;

    if (!chr_id || !usr_id) {
      return res.status(400).json({
        success: false,
        message: "Church ID and User ID are required",
      });
    }

    await approveFollower(chr_id, usr_id, adminUsrId);

    return res.status(200).json({
      success: true,
      message: "Follower approved successfully",
    });
  } catch (error) {
    console.error("❌ approve follower error:", error.message);

    const status =
      error.message.toLowerCase().includes("not authorized")
        ? 403
        : error.message.toLowerCase().includes("not found")
        ? 404
        : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   REJECT FOLLOWER
============================================================ */

async function reject(req, res) {
  try {
    const { chr_id, usr_id } = req.params;
    const adminUsrId = req.user.usr_id;

    if (!chr_id || !usr_id) {
      return res.status(400).json({
        success: false,
        message: "Church ID and User ID are required",
      });
    }

    await rejectFollower(chr_id, usr_id, adminUsrId);

    return res.status(200).json({
      success: true,
      message: "Follower rejected successfully",
    });
  } catch (error) {
    console.error("❌ reject follower error:", error.message);

    const status =
      error.message.toLowerCase().includes("not authorized")
        ? 403
        : error.message.toLowerCase().includes("not found")
        ? 404
        : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  pending,
  approve,
  reject,
};

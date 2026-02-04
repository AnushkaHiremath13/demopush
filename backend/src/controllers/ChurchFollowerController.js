// src/controllers/ChurchFollowerController.js

const {
  getPendingFollowers,
  approveFollower,
  rejectFollower,
} = require("../services/ChurchFollowerService");

/* ============================================================
   GET PENDING FOLLOWERS
============================================================ */

async function pending(req, res) {
  try {
    const followers = await getPendingFollowers({
      handlerUid: req.user.uid,
    });

    return res.status(200).json({
      success: true,
      followers,
    });
  } catch (error) {
    return res.status(403).json({
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
    const { uid } = req.params;

    const result = await approveFollower({
      handlerUid: req.user.uid,
      followerUid: uid,
    });

    return res.status(200).json({
      success: true,
      message: "Follower approved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(403).json({
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
    const { uid } = req.params;

    const result = await rejectFollower({
      handlerUid: req.user.uid,
      followerUid: uid,
    });

    return res.status(200).json({
      success: true,
      message: "Follower rejected successfully",
      data: result,
    });
  } catch (error) {
    return res.status(403).json({
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

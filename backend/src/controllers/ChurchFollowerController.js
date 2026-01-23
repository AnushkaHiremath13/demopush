const {
  getPendingFollowers,
  approveFollower,
  rejectFollower,
} = require("../services/ChurchFollowerService");

/* ================= GET PENDING FOLLOWERS ================= */

async function pending(req, res) {
  try {
    const followers = await getPendingFollowers({
      handlerUid: req.user.uid,
    });

    return res.status(200).json({ followers });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
}

/* ================= APPROVE FOLLOWER ================= */

async function approve(req, res) {
  try {
    const { uid } = req.params;

    const result = await approveFollower({
      handlerUid: req.user.uid,
      followerUid: uid,
    });

    return res.status(200).json({
      message: "Follower approved successfully",
      result,
    });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
}

/* ================= REJECT FOLLOWER ================= */

async function reject(req, res) {
  try {
    const { uid } = req.params;

    const result = await rejectFollower({
      handlerUid: req.user.uid,
      followerUid: uid,
    });

    return res.status(200).json({
      message: "Follower rejected successfully",
      result,
    });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
}

module.exports = {
  pending,
  approve,
  reject,
};

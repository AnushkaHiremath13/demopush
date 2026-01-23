const {
  getAllPlatformUsers,
  blockUser,
  unblockUser,
} = require("../services/PlatformUserService");

/* ================= GET PLATFORM USERS ================= */

async function getUsers(req, res) {
  try {
    const users = await getAllPlatformUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ================= BLOCK USER ================= */

async function block(req, res) {
  try {
    const { uid } = req.params;
    await blockUser({ uid });
    return res.status(200).json({ message: "User blocked" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/* ================= UNBLOCK USER ================= */

async function unblock(req, res) {
  try {
    const { uid } = req.params;
    await unblockUser({ uid });
    return res.status(200).json({ message: "User unblocked" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getUsers,
  block,
  unblock,
};

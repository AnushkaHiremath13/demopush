// src/controllers/PlatformChurchController.js

const {
  assignChurchAuthority,
  suspendChurch,
  activateChurch,
} = require("../services/PlatformChurchService");

const prisma = require("../config/prisma");

/* ============================================================
   GET ALL APPROVED CHURCHES
============================================================ */

async function getAllChurches(req, res) {
  try {
    const churches = await prisma.tblchurch.findMany({
      where: {
        approvalstatus: "APPROVED",
      },
      select: {
        cid: true,
        ccode: true,
        cname: true,
        cemail: true,
        ccity: true,
        cstate: true,
        ccountry: true,
        cstatus: true,
      },
      orderBy: {
        createdat: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      churches,
    });
  } catch (error) {
    console.error("GetAllChurches error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch churches",
    });
  }
}

/* ============================================================
   SUSPEND CHURCH
============================================================ */

async function suspend(req, res) {
  try {
    const { cid } = req.params;

    const result = await suspendChurch({ cid });

    return res.status(200).json({
      success: true,
      message: "Church suspended successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   ACTIVATE CHURCH
============================================================ */

async function activate(req, res) {
  try {
    const { cid } = req.params;

    const result = await activateChurch({ cid });

    return res.status(200).json({
      success: true,
      message: "Church activated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/* ============================================================
   ASSIGN CHURCH AUTHORITY
============================================================ */

async function assignAuthority(req, res) {
  try {
    const { cid } = req.params;
    const { uemail } = req.body;

    if (!uemail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const result = await assignChurchAuthority({
      cid,
      uemail,
      platformUid: req.user.uid,
    });

    return res.status(200).json({
      success: true,
      message: "Church authority assigned successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


/* ============================================================
   GET CHURCH BY ID (SAFE)
============================================================ */

async function getChurchById(req, res) {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).json({
        success: false,
        message: "Church ID is required",
      });
    }

    const church = await prisma.tblchurch.findUnique({
      where: { cid },
    });

    if (!church) {
      return res.status(404).json({
        success: false,
        message: "Church not found",
      });
    }

    return res.status(200).json({
      success: true,
      church,
    });
  } catch (error) {
    console.error("❌ getChurchById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  assignAuthority,
  getAllChurches,
  suspend,
  activate,
  getChurchById,
};

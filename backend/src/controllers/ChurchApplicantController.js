// src/controllers/ChurchApplicantController.js

const {
  getPendingApplications,
  getApplicationById,
  createApplication,
  approveApplication,
  rejectApplication,
} = require("../services/ChurchApplicantService");

/* ================= GET ALL PENDING APPLICATIONS ================= */

async function getChurchApplicants(req, res) {
  try {
    const applications = await getPendingApplications();

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("❌ getChurchApplicants:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch church applications",
    });
  }
}

/* ================= GET SINGLE APPLICATION ================= */

async function getChurchApplicantById(req, res) {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    const application = await getApplicationById(applicationId);

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("❌ getChurchApplicantById:", error.message);

    const status =
      error.message.toLowerCase().includes("not found") ? 404 : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= CREATE APPLICATION (PUBLIC) ================= */

async function createChurchApplicant(req, res) {
  try {
    const application = await createApplication(req.body);

    return res.status(201).json({
      success: true,
      message: "Church application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("❌ createChurchApplicant:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= APPROVE APPLICATION (PLATFORM) ================= */

async function approveChurchApplicant(req, res) {
  try {
    const { applicationId } = req.params;

    if (!req.user || !req.user.plt_id) {
      return res.status(401).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    const platformAdminId = req.user.plt_id;

    await approveApplication(applicationId, platformAdminId);

    return res.status(200).json({
      success: true,
      message: "Church approved successfully",
    });
  } catch (error) {
    console.error("❌ approveChurchApplicant:", error.message);

    const status =
      error.message.toLowerCase().includes("not found")
        ? 404
        : error.message.toLowerCase().includes("already")
        ? 400
        : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

/* ================= REJECT APPLICATION (PLATFORM) ================= */

async function rejectChurchApplicant(req, res) {
  try {
    const { applicationId } = req.params;

    if (!req.user || !req.user.plt_id) {
      return res.status(401).json({
        success: false,
        message: "Platform authentication required",
      });
    }

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    const platformAdminId = req.user.plt_id;

    await rejectApplication(applicationId, platformAdminId);

    return res.status(200).json({
      success: true,
      message: "Church application rejected",
    });
  } catch (error) {
    console.error("❌ rejectChurchApplicant:", error.message);

    const status =
      error.message.toLowerCase().includes("not found")
        ? 404
        : error.message.toLowerCase().includes("already")
        ? 400
        : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getChurchApplicants,
  getChurchApplicantById,
  createChurchApplicant,
  approveChurchApplicant,
  rejectChurchApplicant,
};

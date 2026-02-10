// src/controllers/UserController.js

const prisma = require("../config/prisma");

/* ============================================================
   GET LOGGED-IN COMMUNITY USER PROFILE
============================================================ */

async function getMe(req, res) {
  try {
    const usr_id = req.user.usr_id;

    const user = await prisma.tbl_user_1.findUnique({
      where: { usr_id },
      include: {
        profile: true, // tbl_user_2
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        // CORE
        usr_id: user.usr_id,
        usr_name: user.usr_name,
        usr_email: user.usr_email,
        usr_phone: user.usr_phone,
        usr_status: user.usr_status,
        usr_email_verified: user.usr_email_verified,
        usr_phone_verified: user.usr_phone_verified,
        usr_created_at: user.usr_created_at,

        // PROFILE (OPTIONAL)
        profile: {
          usr_address: user.profile?.usr_address ?? "",
          usr_city: user.profile?.usr_city ?? "",
          usr_state: user.profile?.usr_state ?? "",
          usr_country: user.profile?.usr_country ?? "",
          usr_pincode: user.profile?.usr_pincode ?? "",
          usr_gender: user.profile?.usr_gender ?? "",
          usr_dob: user.profile?.usr_dob ?? null,
          usr_profile_image: user.profile?.usr_profile_image ?? "",
        },
      },
    });
  } catch (error) {
    console.error("❌ getMe error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load user profile",
    });
  }
}

module.exports = {
  getMe,
};

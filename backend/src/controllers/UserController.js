const prisma = require("../config/prisma");

/* ================= GET LOGGED IN USER PROFILE ================= */

async function getMe(req, res) {
  try {
    const uid = req.user.uid;

    const user = await prisma.tbluser1.findUnique({
      where: { uid },
      include: {
        tbluser2: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      uid: user.uid,
      uname: user.uname,
      uemail: user.uemail,
      uphone: user.uphone,
      ustatus: user.ustatus,
      uisplatform: user.uisplatform,
      uisemployee: user.uisemployee,
      uisfollower: user.uisfollower,
      uemailverified: user.uemailverified,
      uphoneverified: user.uphoneverified,
      createdat: user.createdat,

      // extended profile
      uaddress: user.tbluser2?.uaddress || "",
      ucity: user.tbluser2?.ucity || "",
      ustate: user.tbluser2?.ustate || "",
      ucountry: user.tbluser2?.ucountry || "",
      upincode: user.tbluser2?.upincode || "",
      ugender: user.tbluser2?.ugender || "",
      udob: user.tbluser2?.udob || "",
    });
  } catch (error) {
    console.error("getMe error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getMe };

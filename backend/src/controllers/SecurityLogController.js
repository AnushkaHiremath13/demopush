// src/controllers/SecurityLogController.js

exports.getSecurityLogs = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Security logs API working",
    data: [],
  });
};

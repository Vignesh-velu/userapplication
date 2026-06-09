const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/auth.middleware");

const {
  sendOTP,
  verifyOTP
} = require("../controllers/otp.controller");

/**
 * Send OTP
 * POST /api/otp/send
 */
router.post(
  "/send",
  authMiddleware,
  sendOTP
);

/**
 * Verify OTP
 * POST /api/otp/verify
 */
router.post(
  "/verify",
  authMiddleware,
  verifyOTP
);

module.exports = router;
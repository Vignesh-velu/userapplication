const User = require("../models/User");
const OTP = require("../models/OTP");

const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../services/sms.service");

/**
 * Send OTP
 * POST /api/otp/send
 */
const sendOTP = async (req, res) => {
  try {

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // OTP expires in 2 minutes
    const expiresAt = new Date(
      Date.now() + 2 * 60 * 1000
    );

    // Remove previous unverified OTPs
    await OTP.deleteMany({
      phone,
      verified: false
    });

    // Save OTP
    await OTP.create({
      userId: user._id,
      phone,
      otp,
      expiresAt,
      verified: false
    });

    // Send SMS
    await sendSMS(phone, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/**
 * Verify OTP
 * POST /api/otp/verify
 */
const verifyOTP = async (req, res) => {
  try {

    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    const otpRecord = await OTP.findOne({
      phone,
      otp,
      verified: false
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    await User.findByIdAndUpdate(
      otpRecord.userId,
      {
        isPhoneVerified: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
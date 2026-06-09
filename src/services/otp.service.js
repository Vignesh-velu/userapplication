const OTP = require("../models/OTP");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");

/**
 * Create and Save OTP
 */
const createOTP = async (userId, phone) => {

  const otp = generateOTP();

  const expiresAt = new Date(
    Date.now() + 2 * 60 * 1000
  );

  const otpRecord = await OTP.create({
    userId,
    phone,
    otp,
    expiresAt,
    verified: false
  });

  return otpRecord;
};


/**
 * Verify OTP
 */
const verifyOTP = async (phone, otp) => {

  const otpRecord =
    await OTP.findOne({
      phone,
      otp,
      verified: false
    });

  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  if (
    otpRecord.expiresAt <
    new Date()
  ) {
    throw new Error("OTP Expired");
  }

  otpRecord.verified = true;

  await otpRecord.save();

  await User.findByIdAndUpdate(
    otpRecord.userId,
    {
      isPhoneVerified: true
    }
  );

  return true;
};


/**
 * Remove old OTPs for a user
 */
const deleteOldOTP = async (phone) => {

  await OTP.deleteMany({
    phone,
    verified: false
  });

};

module.exports = {
  createOTP,
  verifyOTP,
  deleteOldOTP
};
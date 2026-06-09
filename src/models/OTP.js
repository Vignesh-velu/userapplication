const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  phone:String,

  otp:String,

  expiresAt:Date,

  verified:{
    type:Boolean,
    default:false
  }

});

module.exports =
mongoose.model("OTP", otpSchema);
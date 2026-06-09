const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    unique:true
  },

  phone:{
    type:String,
    required:true
  },

  password:{
    type:String,
    required:true
  },

  isPhoneVerified:{
    type:Boolean,
    default:false
  }

},{
  timestamps:true
});

module.exports =
mongoose.model("User", userSchema);
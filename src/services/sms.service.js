const client =
require("../config/twilio");

const sendSMS =
async(phone, otp)=>{

 await client.messages.create({

   body:
   `Your verification code is ${otp}`,

   from:
   process.env.TWILIO_PHONE_NUMBER,

   to:phone

 });

};

module.exports = sendSMS;
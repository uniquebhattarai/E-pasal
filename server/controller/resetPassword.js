
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.resetPasswordToken= async (req,res)=>{
   try {
   
     const email = req.body.email;
     
     const user = await User.findOne({email:email});
     if(!user){
         return res.status(400).json({
             success:false,
             message:"user doesnot exist"
         });
     }
  
     const token = crypto.randomUUID();
  
     const updatedDetails = await User.findOneAndUpdate({email:email},{
         token:token,
         resetPasswordExpires:Date.now()+5*60*1000
     },{
         new:true
     });
 
     const url =`${process.env.FRONTEND_URL}/update-password/${token}`

     await mailSender(email,"Password reset link",`password reset link:${url}`);
    
     return res.json({
         success:true,
         message:"E-mail sent successfully, please check email and change password",
     });
 
   } catch (error) {
    console.error(error)
    return res.status(500).json({
        success:fail,
        message:"Error while reseting password"
    });
   }
    
}



//resetpassword

exports.resetPassword= async (req,res)=>{
    try {
        //data fetch
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"Password Do not match",
        });
    }
    //get user details from db using token
    const userDetails = await User.findOne({token:token});
    //if no entry invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid"
        });
    }
    //check token time
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:"Token is expired,please regenerate your token",
        });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    //update the password
    await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
    //return response
    return res.status(200).json({
        success:true,
        message:"Password reset sucessful",
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while reseting password",
        });
    }
}
const User = require("../models/user");
const OTP = require("../models/otp");
const Profile = require("../models/profile");  
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/emailTemplates");
require("dotenv").config();



exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

 
    const checkUserPresent = await User.findOne({ email: email.toLowerCase() });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated:", otp);


    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

  
    const otpPayload = { email: email.toLowerCase(), otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP saved in DB:", otpBody);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are necessary",
      });
    }


    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords must match",
      });
    }

  
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    
    const recentOtp = await OTP.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP does not match",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "Signup successful",
      user: newUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error while doing signup",
      error: error.message,
    });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Every field is necessary",
      });
    }

    const userDetails = await User.findOne({ email: email.toLowerCase() }).populate("additionalDetails");
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "User does not exist, please signup",
      });
    }

    if (await bcrypt.compare(password, userDetails.password)) {
      const payload = {
        email: userDetails.email,
        id: userDetails._id,
        role: userDetails.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      userDetails.token = token;
      userDetails.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: userDetails,
        message: "Logged in successfully",
      });

    } else {
      return res.status(200).json({
        success: false,
        message: "Password is incorrect",
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error while login, please try again later",
      error: error.message,
    });
  }
};



exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      await mailSender(
        updatedUserDetails.email,
        `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
        passwordUpdated(updatedUserDetails.email, updatedUserDetails.firstName)
      );
    } catch (mailError) {
      console.error(mailError);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending password update email",
        error: mailError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
      error: error.message,
    });
  }
};

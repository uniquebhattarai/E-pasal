const User = require("../models/user");
const OTP = require("../models/otp");
const Profile = require("../models/profile");  
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const path = require("path");
const fs = require("fs");
const { passwordUpdated } = require("../mail/templates/emailTemplates");
require("dotenv").config();

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + "_refresh";



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

    console.info("OTP generated and sent via email.");


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
    console.info("OTP record created in DB.");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // otp is intentionally NOT returned — user must check their email
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
      image: null,
    });

    newUser.password = undefined;

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

    const userDetails = await User.findOne({ email: email.toLowerCase() })
      .populate("additionalDetails");
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

      // 1. Short-lived Access Token (15 minutes)
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      // 2. Long-lived Refresh Token (30 days — Amazon / Daraz standard)
      const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      });

      if (userDetails.image && userDetails.image.includes("dicebear.com")) {
        userDetails.image = null;
        await User.findByIdAndUpdate(userDetails._id, { image: null });
      }

      // Access Token Cookie (15 minutes)
      const accessTokenOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        httpOnly: true,
        path: "/",
      };

      // Refresh Token Cookie (30 days)
      const refreshTokenOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
      };

      const userResponse = userDetails.toObject();
      delete userResponse.password;
      delete userResponse.cart;
      delete userResponse.wishlist;
      delete userResponse.token;

      // Set both cookies securely (httpOnly)
      res.cookie("token", token, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);

      return res.status(200).json({
        success: true,
        user: userResponse,
        token: token,
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

// Refresh Access Token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired. Please login again.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.accountType,
    };

    // Issue a new fresh 15-minute Access Token
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Rolling 30-day Refresh Token (Amazon / Daraz standard)
    const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });

    const accessTokenOptions = {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
      path: "/",
    };

    const refreshTokenOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
    };

    res.cookie("token", newAccessToken, accessTokenOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while refreshing token",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.cookie("token", "", cookieOptions);
    res.cookie("refreshToken", "", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
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
        `Password Updated Successfully - e-pasal`,
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

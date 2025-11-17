const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }


    const token = crypto.randomUUID();


    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true }
    );

    const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

    await mailSender(email, "Password Reset Link", `
      <p>Click the link below to reset your password:</p>
      <a href="${url}">${url}</a>
    `);

    return res.json({
      success: true,
      message: "Email sent successfully. Check your inbox.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while generating reset token",
    });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check user with token
    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expired. Try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
        token: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while resetting password",
    });
  }
};

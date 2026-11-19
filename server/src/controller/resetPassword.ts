import { Response } from "express";
import User from "../models/user";
import mailSender from "../utils/mailSender";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { passwordResetTemplate } from "../mail/templates/emailTemplates";
import { AuthenticatedRequest } from "../types";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const resetPasswordToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

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
        resetPasswordExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
      { new: true }
    );

    const frontendUrl =
      process.env.FRONTEND_URL || "https://e-pasal-two.vercel.app";
    const url = `${frontendUrl}/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset Link - e-pasal",
      passwordResetTemplate(url, email)
    );

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

export const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword || !token) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const userDetails = await User.findOne({ token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }

    if (
      userDetails.resetPasswordExpires &&
      userDetails.resetPasswordExpires.getTime() < Date.now()
    ) {
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

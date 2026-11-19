import { Response } from "express";
import User from "../models/user";
import OTP from "../models/otp";
import Profile from "../models/profile";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender";
import { passwordUpdated } from "../mail/templates/emailTemplates";
import { AuthenticatedRequest, AuthJwtPayload } from "../types";
import dotenv from "dotenv";

dotenv.config();

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET + "_refresh");

export const sendOtp = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const checkUserPresent = await User.findOne({ email: email.toLowerCase() });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    let otp = (otpGenerator as any).generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp });
    while (result) {
      otp = (otpGenerator as any).generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    const otpPayload = { email: email.toLowerCase(), otp };
    await OTP.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signUp = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
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

    const userObj = newUser.toObject();
    delete (userObj as any).password;

    return res.status(200).json({
      success: true,
      message: "Signup successful",
      user: userObj,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error while doing signup",
      error: error.message,
    });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
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

    if (await bcrypt.compare(password, userDetails.password || "")) {
      const payload: AuthJwtPayload = {
        email: userDetails.email,
        id: (userDetails._id as any).toString(),
        role: userDetails.accountType,
      };

      const jwtSecret = process.env.JWT_SECRET as string;

      // 1. Short-lived Access Token (15 minutes)
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "15m",
      });

      // 2. Long-lived Refresh Token (30 days)
      const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      });

      if (userDetails.image && userDetails.image.includes("dicebear.com")) {
        userDetails.image = null;
        await User.findByIdAndUpdate(userDetails._id, { image: null });
      }

      const isProduction =
        process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

      const accessTokenOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        httpOnly: true,
        path: "/",
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        secure: isProduction,
      };

      const refreshTokenOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        secure: isProduction,
      };

      const userResponse: any = userDetails.toObject();
      delete userResponse.password;
      delete userResponse.cart;
      delete userResponse.wishlist;
      delete userResponse.token;

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
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error while login, please try again later",
      error: error.message,
    });
  }
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    let decoded: any;
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

    const payload: AuthJwtPayload = {
      email: user.email,
      id: (user._id as any).toString(),
      role: user.accountType,
    };

    const jwtSecret = process.env.JWT_SECRET as string;
    const newAccessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });

    const isProduction =
      process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

    const accessTokenOptions = {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      secure: isProduction,
    };

    const refreshTokenOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      secure: isProduction,
    };

    res.cookie("token", newAccessToken, accessTokenOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newAccessToken,
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while refreshing token",
      error: error.message,
    });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const isProduction =
      process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      secure: isProduction,
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.cookie("token", "", cookieOptions);
    res.cookie("refreshToken", "", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
      error: error.message,
    });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userDetails = await User.findById(req.user.id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password || "");
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

    if (updatedUserDetails) {
      try {
        await mailSender(
          updatedUserDetails.email,
          `Password Updated Successfully - e-pasal`,
          passwordUpdated(updatedUserDetails.email, updatedUserDetails.firstName)
        );
      } catch (mailError: any) {
        console.error(mailError);
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending password update email",
          error: mailError.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
      error: error.message,
    });
  }
};

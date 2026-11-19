import User from "../users/user.model";
import Profile from "../users/profile.model";
import OTP from "./otp.model";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mailSender from "../../utils/mailSender";
import { passwordUpdated, passwordResetTemplate } from "../../mail/templates/emailTemplates";
import { AuthJwtPayload } from "../../types";
import dotenv from "dotenv";

dotenv.config();

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET + "_refresh");

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType?: string;
  contactNumber?: string;
  otp: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
  token: string;
}

export const sendOtp = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const checkUserPresent = await User.findOne({ email: email.toLowerCase() });
  if (checkUserPresent) {
    const error: any = new Error("User already registered");
    error.statusCode = 401;
    throw error;
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

  return { message: "OTP sent successfully" };
};

export const signUp = async (input: SignUpInput) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp,
  } = input;

  if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
    const error: any = new Error("All fields are necessary");
    error.statusCode = 403;
    throw error;
  }

  if (password !== confirmPassword) {
    const error: any = new Error("Passwords must match");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error: any = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const recentOtp = await OTP.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
  if (!recentOtp) {
    const error: any = new Error("OTP not found");
    error.statusCode = 400;
    throw error;
  } else if (otp !== recentOtp.otp) {
    const error: any = new Error("OTP does not match");
    error.statusCode = 400;
    throw error;
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

  return userObj;
};

export const login = async (input: LoginInput) => {
  const { email, password } = input;

  if (!email || !password) {
    const error: any = new Error("Every field is necessary");
    error.statusCode = 403;
    throw error;
  }

  const userDetails = await User.findOne({ email: email.toLowerCase() }).populate("additionalDetails");
  if (!userDetails) {
    const error: any = new Error("User does not exist, please signup");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, userDetails.password || "");
  if (!isPasswordMatch) {
    return { isPasswordMatch: false, user: null, token: null, refreshToken: null };
  }

  const payload: AuthJwtPayload = {
    email: userDetails.email,
    id: (userDetails._id as any).toString(),
    role: userDetails.accountType,
  };

  const jwtSecret = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

  if (userDetails.image && userDetails.image.includes("dicebear.com")) {
    userDetails.image = null;
    await User.findByIdAndUpdate(userDetails._id, { image: null });
  }

  const userResponse: any = userDetails.toObject();
  delete userResponse.password;
  delete userResponse.cart;
  delete userResponse.wishlist;
  delete userResponse.token;

  return {
    isPasswordMatch: true,
    user: userResponse,
    token,
    refreshToken,
  };
};

export const refreshToken = async (incomingRefreshToken: string) => {
  if (!incomingRefreshToken) {
    const error: any = new Error("Refresh token is missing");
    error.statusCode = 401;
    throw error;
  }

  let decoded: any;
  try {
    decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    const error: any = new Error("Refresh token is invalid or expired. Please login again.");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  const payload: AuthJwtPayload = {
    email: user.email,
    id: (user._id as any).toString(),
    role: user.accountType,
  };

  const jwtSecret = process.env.JWT_SECRET as string;
  const newAccessToken = jwt.sign(payload, jwtSecret, { expiresIn: "15m" });
  const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

  return {
    newAccessToken,
    newRefreshToken,
  };
};

export const changePassword = async (input: ChangePasswordInput) => {
  const { userId, oldPassword, newPassword } = input;

  if (!userId) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const userDetails = await User.findById(userId);
  if (!userDetails) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password || "");
  if (!isPasswordMatch) {
    const error: any = new Error("Old password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUserDetails = await User.findByIdAndUpdate(
    userId,
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
    } catch (mailError) {
      console.error("Mail error during password change:", mailError);
    }
  }

  return { message: "Password updated successfully" };
};

export const resetPasswordToken = async (email: string) => {
  if (!email) {
    const error: any = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error: any = new Error("User does not exist");
    error.statusCode = 400;
    throw error;
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

  return { message: "Email sent successfully. Check your inbox." };
};

export const resetPassword = async (input: ResetPasswordInput) => {
  const { password, confirmPassword, token } = input;

  if (!password || !confirmPassword || !token) {
    return { success: false, message: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const userDetails = await User.findOne({ token });
  if (!userDetails) {
    return { success: false, message: "Invalid token" };
  }

  if (
    userDetails.resetPasswordExpires &&
    userDetails.resetPasswordExpires.getTime() < Date.now()
  ) {
    return { success: false, message: "Token expired. Try again." };
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

  return { success: true, message: "Password reset successful" };
};

export default {
  sendOtp,
  signUp,
  login,
  refreshToken,
  changePassword,
  resetPasswordToken,
  resetPassword,
};

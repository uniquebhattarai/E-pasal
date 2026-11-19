var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_express7 = __toESM(require("express"));
var import_dotenv4 = __toESM(require("dotenv"));
var import_cors = __toESM(require("cors"));
var import_express_fileupload = __toESM(require("express-fileupload"));
var import_cookie_parser = __toESM(require("cookie-parser"));

// src/modules/auth/auth.routes.ts
var import_express = __toESM(require("express"));

// src/modules/users/user.model.ts
var import_mongoose = __toESM(require("mongoose"));
var userSchema = new import_mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    enum: ["Customer", "Admin"],
    default: "Customer"
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  additionalDetails: {
    type: import_mongoose.default.Schema.Types.ObjectId,
    required: true,
    ref: "profile"
  },
  wishlist: [
    {
      type: import_mongoose.default.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  cart: [
    {
      type: import_mongoose.default.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  token: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date
  }
});
var User = import_mongoose.default.model("User", userSchema);
var user_model_default = User;

// src/modules/users/profile.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var profileSchema = new import_mongoose2.Schema({
  gender: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: String,
    default: null
  },
  about: {
    type: String,
    trim: true,
    default: null
  },
  contactNumber: {
    type: Number,
    default: null
  }
});
var Profile = import_mongoose2.default.model("profile", profileSchema);
var profile_model_default = Profile;

// src/modules/auth/otp.model.ts
var import_mongoose3 = __toESM(require("mongoose"));

// src/utils/mailSender.ts
var import_nodemailer = __toESM(require("nodemailer"));
var mailSender = async (email, title, body, attachments = []) => {
  try {
    const transporter = import_nodemailer.default.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    const mailOptions = {
      from: `"e-pasal" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body
    };
    if (Array.isArray(attachments) && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info?.messageId || info);
    return info;
  } catch (error) {
    console.error("Error while sending mail in mailSender:", error);
    throw error;
  }
};
var mailSender_default = mailSender;

// src/mail/templates/emailTemplates.ts
var emailShell = ({ title, badgeText, heading, bodyContent, footerText }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7fb; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Top Accent Bar (Brand Blue Gradient) -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #5891f8 0%, #0c61f6 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px; text-align: center;">
              
              <!-- Logo -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 22px;">
                    <a href="https://epasal.com" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="https://res.cloudinary.com/dmr1vnpun/image/upload/v1794596618/unique/epasal_logo.png" alt="e-\u092A\u0938\u0932" width="150" style="display: block; max-width: 160px; height: auto; border: 0; margin: 0 auto;" />
                    </a>
                  </td>
                </tr>
              </table>

              ${badgeText ? `
              <!-- Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px auto;">
                <tr>
                  <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; color: #0c61f6; letter-spacing: 0.8px; text-transform: uppercase;">
                    ${badgeText}
                  </td>
                </tr>
              </table>` : ""}

              ${heading ? `
              <!-- Main Heading -->
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${heading}
              </h1>` : ""}
              
              <!-- Body Content -->
              ${bodyContent}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                ${footerText || 'Need help? Reach out to <a href="mailto:support@epasal.com" style="color: #0c61f6; text-decoration: none; font-weight: 600;">support@epasal.com</a>'}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} e-\u092A\u0938\u0932. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
var otpTemplate = (otp) => {
  return emailShell({
    title: "Verify Your Email - e-\u092A\u0938\u0932",
    badgeText: "Account Verification",
    heading: "Verify Your Email Address",
    bodyContent: `
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Thank you for joining <strong>e-\u092A\u0938\u0932</strong>! Please use the following 6-digit verification code to complete your registration and activate your account:
      </p>

      <!-- OTP Code Box -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px 0;">
        <tr>
          <td align="center" style="background: #f8faff; border: 1.5px dashed #3b82f6; border-radius: 14px; padding: 20px 16px;">
            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">
              Your 6-Digit Code
            </div>
            <div style="font-family: 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0c61f6; padding-left: 10px; margin: 4px 0 6px 0;">
              ${otp}
            </div>
            <div style="font-size: 12px; color: #94a3b8; font-weight: 500;">
              &#9201; Valid for 10 minutes
            </div>
          </td>
        </tr>
      </table>

      <!-- Security Disclaimers -->
      <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        Never share this code with anyone. e-\u092A\u0938\u0932 will never ask for your verification code.
      </p>
      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        If you didn't request this email, you can safely ignore it.
      </p>
    `
  });
};
var passwordUpdated = (email, name = "User") => {
  return emailShell({
    title: "Password Updated - e-\u092A\u0938\u0932",
    badgeText: "Security Notice",
    heading: "Password Successfully Updated",
    bodyContent: `
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Your password has been successfully updated for the account associated with <span style="font-weight: 600; color: #0c61f6;">${email}</span>.
      </p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 20px 0;">
        <tr>
          <td style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #b91c1c; text-align: left; line-height: 1.5;">
            <strong>Important:</strong> If you did not make this change, please contact our support team immediately to secure your account.
          </td>
        </tr>
      </table>
    `
  });
};
var passwordResetTemplate = (url, email) => {
  return emailShell({
    title: "Reset Your Password - e-\u092A\u0938\u0932",
    badgeText: "Password Reset",
    heading: "Reset Your Password",
    bodyContent: `
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        We received a request to reset your password for <span style="font-weight: 600; color: #0c61f6;">${email}</span>. Click the button below to set a new password:
      </p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 24px auto;">
        <tr>
          <td align="center" style="border-radius: 10px; background: linear-gradient(90deg, #5891f8 0%, #0c61f6 100%);">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
              Reset Password
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        This reset link will expire in 5 minutes. If you did not request a password reset, you can safely disregard this email.
      </p>
      <p style="margin: 0; font-size: 11px; line-height: 1.4; color: #cbd5e1; word-break: break-all;">
        Or copy and paste this link: <a href="${url}" style="color: #0c61f6;">${url}</a>
      </p>
    `
  });
};

// src/modules/auth/otp.model.ts
var otpSchema = new import_mongoose3.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60
  }
});
async function sendVerificationEmail(email, otp) {
  try {
    const htmlBody = otpTemplate(otp);
    const mailResponse = await mailSender(
      email,
      "Verification Email from e-\u092A\u0938\u0932",
      htmlBody
    );
    console.log("Verification email sent successfully:", mailResponse?.messageId);
  } catch (error) {
    console.error("Error while sending verification email:", error);
    throw error;
  }
}
otpSchema.pre("save", async function(next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
var OTP = import_mongoose3.default.model("OTP", otpSchema);
var otp_model_default = OTP;

// src/modules/auth/auth.service.ts
var import_otp_generator = __toESM(require("otp-generator"));
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_crypto = __toESM(require("crypto"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + "_refresh";
var sendOtp = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }
  const checkUserPresent = await user_model_default.findOne({ email: email.toLowerCase() });
  if (checkUserPresent) {
    const error = new Error("User already registered");
    error.statusCode = 401;
    throw error;
  }
  let otp = import_otp_generator.default.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
  let result = await otp_model_default.findOne({ otp });
  while (result) {
    otp = import_otp_generator.default.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    result = await otp_model_default.findOne({ otp });
  }
  const otpPayload = { email: email.toLowerCase(), otp };
  await otp_model_default.create(otpPayload);
  return { message: "OTP sent successfully" };
};
var signUp = async (input) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp
  } = input;
  if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
    const error = new Error("All fields are necessary");
    error.statusCode = 403;
    throw error;
  }
  if (password !== confirmPassword) {
    const error = new Error("Passwords must match");
    error.statusCode = 400;
    throw error;
  }
  const existingUser = await user_model_default.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }
  const recentOtp = await otp_model_default.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
  if (!recentOtp) {
    const error = new Error("OTP not found");
    error.statusCode = 400;
    throw error;
  } else if (otp !== recentOtp.otp) {
    const error = new Error("OTP does not match");
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = await import_bcrypt.default.hash(password, 10);
  const profileDetails = await profile_model_default.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null
  });
  const newUser = await user_model_default.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashedPassword,
    accountType,
    contactNumber,
    additionalDetails: profileDetails._id,
    image: null
  });
  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
};
var login = async (input) => {
  const { email, password } = input;
  if (!email || !password) {
    const error = new Error("Every field is necessary");
    error.statusCode = 403;
    throw error;
  }
  const userDetails = await user_model_default.findOne({ email: email.toLowerCase() }).populate("additionalDetails");
  if (!userDetails) {
    const error = new Error("User does not exist, please signup");
    error.statusCode = 401;
    throw error;
  }
  const isPasswordMatch = await import_bcrypt.default.compare(password, userDetails.password || "");
  if (!isPasswordMatch) {
    return { isPasswordMatch: false, user: null, token: null, refreshToken: null };
  }
  const payload = {
    email: userDetails.email,
    id: userDetails._id.toString(),
    role: userDetails.accountType
  };
  const jwtSecret = process.env.JWT_SECRET;
  const token = import_jsonwebtoken.default.sign(payload, jwtSecret, { expiresIn: "15m" });
  const refreshToken3 = import_jsonwebtoken.default.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
  if (userDetails.image && userDetails.image.includes("dicebear.com")) {
    userDetails.image = null;
    await user_model_default.findByIdAndUpdate(userDetails._id, { image: null });
  }
  const userResponse = userDetails.toObject();
  delete userResponse.password;
  delete userResponse.cart;
  delete userResponse.wishlist;
  delete userResponse.token;
  return {
    isPasswordMatch: true,
    user: userResponse,
    token,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    const error = new Error("Refresh token is missing");
    error.statusCode = 401;
    throw error;
  }
  let decoded;
  try {
    decoded = import_jsonwebtoken.default.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    const error = new Error("Refresh token is invalid or expired. Please login again.");
    error.statusCode = 401;
    throw error;
  }
  const user = await user_model_default.findById(decoded.id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  const payload = {
    email: user.email,
    id: user._id.toString(),
    role: user.accountType
  };
  const jwtSecret = process.env.JWT_SECRET;
  const newAccessToken = import_jsonwebtoken.default.sign(payload, jwtSecret, { expiresIn: "15m" });
  const newRefreshToken = import_jsonwebtoken.default.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
  return {
    newAccessToken,
    newRefreshToken
  };
};
var changePassword = async (input) => {
  const { userId, oldPassword, newPassword } = input;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  const userDetails = await user_model_default.findById(userId);
  if (!userDetails) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const isPasswordMatch = await import_bcrypt.default.compare(oldPassword, userDetails.password || "");
  if (!isPasswordMatch) {
    const error = new Error("Old password is incorrect");
    error.statusCode = 401;
    throw error;
  }
  const encryptedPassword = await import_bcrypt.default.hash(newPassword, 10);
  const updatedUserDetails = await user_model_default.findByIdAndUpdate(
    userId,
    { password: encryptedPassword },
    { new: true }
  );
  if (updatedUserDetails) {
    try {
      await mailSender_default(
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
var resetPasswordToken = async (email) => {
  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }
  const user = await user_model_default.findOne({ email });
  if (!user) {
    const error = new Error("User does not exist");
    error.statusCode = 400;
    throw error;
  }
  const token = import_crypto.default.randomUUID();
  await user_model_default.findOneAndUpdate(
    { email },
    {
      token,
      resetPasswordExpires: new Date(Date.now() + 5 * 60 * 1e3)
      // 5 minutes
    },
    { new: true }
  );
  const frontendUrl = process.env.FRONTEND_URL || "https://e-pasal-two.vercel.app";
  const url = `${frontendUrl}/update-password/${token}`;
  await mailSender_default(
    email,
    "Password Reset Link - e-pasal",
    passwordResetTemplate(url, email)
  );
  return { message: "Email sent successfully. Check your inbox." };
};
var resetPassword = async (input) => {
  const { password, confirmPassword, token } = input;
  if (!password || !confirmPassword || !token) {
    return { success: false, message: "All fields are required" };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }
  const userDetails = await user_model_default.findOne({ token });
  if (!userDetails) {
    return { success: false, message: "Invalid token" };
  }
  if (userDetails.resetPasswordExpires && userDetails.resetPasswordExpires.getTime() < Date.now()) {
    return { success: false, message: "Token expired. Try again." };
  }
  const hashedPassword = await import_bcrypt.default.hash(password, 10);
  await user_model_default.findOneAndUpdate(
    { token },
    {
      password: hashedPassword,
      token: null,
      resetPasswordExpires: null
    },
    { new: true }
  );
  return { success: true, message: "Password reset successful" };
};
var auth_service_default = {
  sendOtp,
  signUp,
  login,
  refreshToken,
  changePassword,
  resetPasswordToken,
  resetPassword
};

// src/modules/auth/auth.controller.ts
var sendOtp2 = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await auth_service_default.sendOtp(email);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("sendOtp error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};
var signUp2 = async (req, res) => {
  try {
    const user = await auth_service_default.signUp(req.body);
    return res.status(200).json({
      success: true,
      message: "Signup successful",
      user
    });
  } catch (error) {
    console.error("signUp error:", error);
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while doing signup"
    });
  }
};
var login2 = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth_service_default.login({ email, password });
    if (!result.isPasswordMatch) {
      return res.status(200).json({
        success: false,
        message: "Password is incorrect"
      });
    }
    const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
    const accessTokenOptions = {
      expires: new Date(Date.now() + 15 * 60 * 1e3),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction
    };
    const refreshTokenOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction
    };
    res.cookie("token", result.token, accessTokenOptions);
    res.cookie("refreshToken", result.refreshToken, refreshTokenOptions);
    return res.status(200).json({
      success: true,
      user: result.user,
      token: result.token,
      message: "Logged in successfully"
    });
  } catch (error) {
    console.error("login error:", error);
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while login, please try again later"
    });
  }
};
var refreshToken2 = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const tokens = await auth_service_default.refreshToken(incomingRefreshToken);
    const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
    const accessTokenOptions = {
      expires: new Date(Date.now() + 15 * 60 * 1e3),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction
    };
    const refreshTokenOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction
    };
    res.cookie("token", tokens.newAccessToken, accessTokenOptions);
    res.cookie("refreshToken", tokens.newRefreshToken, refreshTokenOptions);
    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: tokens.newAccessToken
    });
  } catch (error) {
    console.error("refreshToken error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while refreshing token"
    });
  }
};
var logout = async (_req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
    const cookieOptions = {
      httpOnly: true,
      expires: /* @__PURE__ */ new Date(0),
      path: "/",
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction
    };
    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.cookie("token", "", cookieOptions);
    res.cookie("refreshToken", "", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
      error: error.message
    });
  }
};
var changePassword2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    const result = await auth_service_default.changePassword({
      userId,
      oldPassword,
      newPassword
    });
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("changePassword error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while updating password"
    });
  }
};

// src/modules/auth/resetPassword.controller.ts
var resetPasswordToken2 = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await auth_service_default.resetPasswordToken(email);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("resetPasswordToken error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while generating reset token"
    });
  }
};
var resetPassword2 = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    const result = await auth_service_default.resetPassword({
      password,
      confirmPassword,
      token
    });
    if (!result.success) {
      return res.status(200).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while resetting password"
    });
  }
};

// src/middleware/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
var auth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing"
      });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured"
      });
    }
    const decoded = import_jsonwebtoken2.default.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
      error: error.message
    });
  }
};
var isAdmin = async (req, res, next) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: email missing"
      });
    }
    const userDetails = await user_model_default.findOne({ email: req.user.email });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin"
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

// src/modules/auth/auth.routes.ts
var router = import_express.default.Router();
router.post("/login", login2);
router.post("/refresh-token", refreshToken2);
router.post("/logout", logout);
router.get("/logout", logout);
router.post("/signup", signUp2);
router.post("/sendotp", sendOtp2);
router.post("/changepassword", auth, changePassword2);
router.post("/reset-password-token", resetPasswordToken2);
router.post("/reset-password", resetPassword2);
var auth_routes_default = router;

// src/modules/users/profile.routes.ts
var import_express2 = __toESM(require("express"));

// src/modules/orders/order.model.ts
var import_mongoose4 = __toESM(require("mongoose"));
var orderSchema = new import_mongoose4.Schema({
  user: { type: import_mongoose4.default.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: import_mongoose4.default.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Paid"
  },
  paymentMethod: {
    type: String,
    default: "eSewa"
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now }
});
var Order = import_mongoose4.default.model("Order", orderSchema);
var order_model_default = Order;

// src/modules/products/product.model.ts
var import_mongoose5 = __toESM(require("mongoose"));
var productSchema = new import_mongoose5.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  brand: { type: String },
  ratings: [
    {
      user: { type: import_mongoose5.default.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String }
    }
  ],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  category: {
    type: import_mongoose5.default.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  createdBy: {
    type: import_mongoose5.default.Schema.Types.ObjectId,
    ref: "User"
  }
});
var Product = import_mongoose5.default.model("Product", productSchema);
var product_model_default = Product;

// src/utils/imageUploader.ts
var import_cloudinary = require("cloudinary");
var uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await import_cloudinary.v2.uploader.upload(file.tempFilePath, options);
};

// src/modules/users/profile.service.ts
var updateProfile = async (input) => {
  const { userId, firstName, lastName, dateOfBirth, about, contactNumber, gender } = input;
  const userDetails = await user_model_default.findById(userId);
  if (!userDetails) {
    const error = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
  }
  let profile = await profile_model_default.findById(userDetails.additionalDetails);
  if (!profile) {
    profile = await profile_model_default.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    });
    userDetails.additionalDetails = profile._id;
    await userDetails.save();
  }
  if (firstName) userDetails.firstName = firstName;
  if (lastName) userDetails.lastName = lastName;
  await userDetails.save();
  profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
  profile.about = about || profile.about;
  profile.contactNumber = contactNumber || profile.contactNumber;
  profile.gender = gender || profile.gender;
  await profile.save();
  const updatedUserDetails = await user_model_default.findById(userId).select("-password").populate("additionalDetails").exec();
  if (updatedUserDetails && updatedUserDetails.image && updatedUserDetails.image.includes("dicebear.com")) {
    updatedUserDetails.image = null;
    await user_model_default.findByIdAndUpdate(userId, { image: null });
  }
  return updatedUserDetails;
};
var updateProfileHeader = async (userId, firstName, lastName, displayPicture) => {
  const userDetails = await user_model_default.findById(userId);
  if (!userDetails) {
    const error = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
  }
  if (firstName) userDetails.firstName = firstName;
  if (lastName !== void 0) userDetails.lastName = lastName;
  if (displayPicture) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const image = await uploadImageToCloudinary(displayPicture, folderName, 1e3, 1e3);
    userDetails.image = image.secure_url;
  }
  await userDetails.save();
  const updatedUserDetails = await user_model_default.findById(userId).select("-password").populate("additionalDetails").exec();
  if (updatedUserDetails && updatedUserDetails.image && updatedUserDetails.image.includes("dicebear.com")) {
    updatedUserDetails.image = null;
    await user_model_default.findByIdAndUpdate(userId, { image: null });
  }
  return updatedUserDetails;
};
var updateAbout = async (userId, about) => {
  const userDetails = await user_model_default.findById(userId);
  if (!userDetails) {
    const error = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
  }
  let profile = await profile_model_default.findById(userDetails.additionalDetails);
  if (!profile) {
    profile = await profile_model_default.create({
      gender: null,
      dateOfBirth: null,
      about: typeof about === "string" ? about : null,
      contactNumber: null
    });
    userDetails.additionalDetails = profile._id;
    await userDetails.save();
  } else {
    profile.about = typeof about === "string" ? about : profile.about;
    await profile.save();
  }
  const updatedUserDetails = await user_model_default.findById(userId).select("-password").populate("additionalDetails").exec();
  if (updatedUserDetails && updatedUserDetails.image && updatedUserDetails.image.includes("dicebear.com")) {
    updatedUserDetails.image = null;
    await user_model_default.findByIdAndUpdate(userId, { image: null });
  }
  return updatedUserDetails;
};
var updatePersonalDetails = async (userId, data) => {
  const { firstName, lastName, dateOfBirth, contactNumber, gender } = data;
  const userDetails = await user_model_default.findById(userId);
  if (!userDetails) {
    const error = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
  }
  if (firstName) userDetails.firstName = firstName;
  if (lastName !== void 0) userDetails.lastName = lastName;
  await userDetails.save();
  let profile = await profile_model_default.findById(userDetails.additionalDetails);
  if (!profile) {
    profile = await profile_model_default.create({
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      about: null,
      contactNumber: contactNumber || null
    });
    userDetails.additionalDetails = profile._id;
    await userDetails.save();
  } else {
    if (dateOfBirth !== void 0) profile.dateOfBirth = dateOfBirth;
    if (contactNumber !== void 0) profile.contactNumber = contactNumber;
    if (gender !== void 0) profile.gender = gender;
    await profile.save();
  }
  const updatedUserDetails = await user_model_default.findById(userId).select("-password").populate("additionalDetails").exec();
  if (updatedUserDetails && updatedUserDetails.image && updatedUserDetails.image.includes("dicebear.com")) {
    updatedUserDetails.image = null;
    await user_model_default.findByIdAndUpdate(userId, { image: null });
  }
  return updatedUserDetails;
};
var deleteAccount = async (userId) => {
  const user = await user_model_default.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  await profile_model_default.findByIdAndDelete(user.additionalDetails);
  await product_model_default.updateMany({ reviews: userId }, { $pull: { reviews: userId } });
  await order_model_default.deleteMany({ user: userId });
  await user_model_default.findByIdAndDelete(userId);
  return { message: "User account deleted successfully" };
};
var getUserDetails = async (userId) => {
  const userDetails = await user_model_default.findById(userId).select("-password -cart -wishlist").populate("additionalDetails").exec();
  if (userDetails && userDetails.image && userDetails.image.includes("dicebear.com")) {
    userDetails.image = null;
    await user_model_default.findByIdAndUpdate(userId, { image: null });
  }
  return userDetails;
};
var updateDisplayPicture = async (userId, displayPicture) => {
  if (!displayPicture) {
    const error = new Error("No image file uploaded");
    error.statusCode = 400;
    throw error;
  }
  const folderName = process.env.FOLDER_NAME || "unique";
  const image = await uploadImageToCloudinary(displayPicture, folderName, 1e3, 1e3);
  const updatedUser = await user_model_default.findByIdAndUpdate(
    userId,
    { image: image.secure_url },
    { new: true }
  ).select("-password");
  return updatedUser;
};
var getUserOrders = async (userId) => {
  const orders = await order_model_default.find({ user: userId }).populate({
    path: "products.product",
    populate: { path: "category" }
  }).sort({ createdAt: -1 });
  return orders || [];
};
var shopDashboard = async (userId) => {
  const products = await product_model_default.find({ createdBy: userId });
  const dashboardData = products.map((product) => {
    const totalOrders = product.orders?.length || 0;
    const totalRevenue = totalOrders * product.price;
    return {
      _id: product._id,
      name: product.name,
      totalOrders,
      totalRevenue
    };
  });
  return dashboardData;
};
var toggleWishlist = async (userId, productId) => {
  if (!productId) {
    const error = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
  }
  const user = await user_model_default.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const wishlist = user.wishlist || [];
  const isWishlisted = wishlist.some(
    (id) => id.toString() === productId.toString()
  );
  let updatedUser;
  if (isWishlisted) {
    updatedUser = await user_model_default.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");
  } else {
    updatedUser = await user_model_default.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");
  }
  return {
    isWishlisted,
    wishlist: updatedUser ? updatedUser.wishlist : []
  };
};
var getWishlist = async (userId) => {
  const user = await user_model_default.findById(userId).populate({
    path: "wishlist",
    populate: {
      path: "category"
    }
  });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user.wishlist || [];
};
var addToCart = async (userId, productId) => {
  if (!productId) {
    const error = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
  }
  const user = await user_model_default.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const cart = user.cart || [];
  const isInCart = cart.some(
    (id) => id.toString() === productId.toString()
  );
  if (isInCart) {
    return { added: false, message: "Item is already in cart", cart: [] };
  }
  const updatedUser = await user_model_default.findByIdAndUpdate(
    userId,
    { $addToSet: { cart: productId } },
    { new: true }
  ).populate({
    path: "cart",
    populate: {
      path: "category"
    }
  });
  return {
    added: true,
    message: "Item added to cart",
    cart: updatedUser ? updatedUser.cart : []
  };
};
var removeFromCart = async (userId, productId) => {
  if (!productId) {
    const error = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
  }
  const updatedUser = await user_model_default.findByIdAndUpdate(
    userId,
    { $pull: { cart: productId } },
    { new: true }
  ).populate({
    path: "cart",
    populate: {
      path: "category"
    }
  });
  return updatedUser ? updatedUser.cart : [];
};
var getCart = async (userId) => {
  const user = await user_model_default.findById(userId).populate({
    path: "cart",
    populate: {
      path: "category"
    }
  });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user.cart || [];
};
var clearCart = async (userId) => {
  await user_model_default.findByIdAndUpdate(userId, { $set: { cart: [] } });
  return [];
};
var profile_service_default = {
  updateProfile,
  updateProfileHeader,
  updateAbout,
  updatePersonalDetails,
  deleteAccount,
  getUserDetails,
  updateDisplayPicture,
  getUserOrders,
  shopDashboard,
  toggleWishlist,
  getWishlist,
  addToCart,
  removeFromCart,
  getCart,
  clearCart
};

// src/modules/users/profile.controller.ts
var updateProfile2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const updatedUserDetails = await profile_service_default.updateProfile({
      userId,
      ...req.body
    });
    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};
var updateProfileHeader2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { firstName, lastName } = req.body;
    const displayPicture = req.files?.displayPicture;
    const updatedUserDetails = await profile_service_default.updateProfileHeader(
      userId,
      firstName,
      lastName,
      displayPicture
    );
    return res.json({
      success: true,
      message: "Profile header updated successfully",
      data: updatedUserDetails,
      updatedUserDetails
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: "Failed to update profile header",
      error: error.message
    });
  }
};
var updateAbout2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { about } = req.body;
    const updatedUserDetails = await profile_service_default.updateAbout(userId, about);
    return res.json({
      success: true,
      message: "About section updated successfully",
      data: updatedUserDetails,
      updatedUserDetails
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: "Failed to update about section",
      error: error.message
    });
  }
};
var updatePersonalDetails2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const updatedUserDetails = await profile_service_default.updatePersonalDetails(userId, req.body);
    return res.json({
      success: true,
      message: "Personal details updated successfully",
      data: updatedUserDetails,
      updatedUserDetails
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: "Failed to update personal details",
      error: error.message
    });
  }
};
var deleteAccount2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const result = await profile_service_default.deleteAccount(userId);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Cannot delete user",
      error: error.message
    });
  }
};
var getUserDetails2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const userDetails = await profile_service_default.getUserDetails(userId);
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateDisplayPicture2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const displayPicture = req.files?.displayPicture;
    const updatedUser = await profile_service_default.updateDisplayPicture(userId, displayPicture);
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};
var getUserOrders2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const orders = await profile_service_default.getUserOrders(userId);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders || [],
      data: orders || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var toggleWishlist2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { productId } = req.body;
    const result = await profile_service_default.toggleWishlist(userId, productId);
    return res.status(200).json({
      success: true,
      message: result.isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      inWishlist: !result.isWishlisted,
      wishlist: result.wishlist
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to toggle wishlist"
    });
  }
};
var getWishlist2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const wishlist = await profile_service_default.getWishlist(userId);
    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch wishlist"
    });
  }
};
var addToCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { productId } = req.body;
    const result = await profile_service_default.addToCart(userId, productId);
    if (!result.added) {
      return res.status(200).json({
        success: false,
        message: result.message
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
      cart: result.cart
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to add item to cart"
    });
  }
};
var removeFromCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { productId } = req.body;
    const cart = await profile_service_default.removeFromCart(userId, productId);
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to remove item from cart"
    });
  }
};
var getCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const cart = await profile_service_default.getCart(userId);
    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch cart"
    });
  }
};
var clearCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const cart = await profile_service_default.clearCart(userId);
    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart"
    });
  }
};

// src/modules/users/profile.routes.ts
var router2 = import_express2.default.Router();
router2.delete("/deleteProfile", auth, deleteAccount2);
router2.put("/updateProfile", auth, updateProfile2);
router2.put("/updateProfileHeader", auth, updateProfileHeader2);
router2.put("/updateAbout", auth, updateAbout2);
router2.put("/updatePersonalDetails", auth, updatePersonalDetails2);
router2.get("/getUserDetails", auth, getUserDetails2);
router2.put("/updateDisplayPicture", auth, updateDisplayPicture2);
router2.post("/toggleWishlist", auth, toggleWishlist2);
router2.get("/getWishlist", auth, getWishlist2);
router2.get("/getCart", auth, getCart2);
router2.post("/addToCart", auth, addToCart2);
router2.post("/removeFromCart", auth, removeFromCart2);
router2.post("/clearCart", auth, clearCart2);
router2.get("/getUserOrders", auth, getUserOrders2);
router2.get("/myOrders", auth, getUserOrders2);
var profile_routes_default = router2;

// src/modules/products/product.routes.ts
var import_express3 = __toESM(require("express"));

// src/modules/categories/category.model.ts
var import_mongoose6 = __toESM(require("mongoose"));
var categorySchema = new import_mongoose6.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  products: [
    {
      type: import_mongoose6.default.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});
var Category = import_mongoose6.default.model("Category", categorySchema);
var category_model_default = Category;

// src/modules/products/product.service.ts
var createProduct = async (input) => {
  const { name, description, price, category, userId, imageFile } = input;
  if (!name || !price || !category) {
    const error = new Error("Name, price, and category are required");
    error.statusCode = 400;
    throw error;
  }
  let imageUrl = "";
  if (imageFile) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const image = await uploadImageToCloudinary(imageFile, folderName);
    imageUrl = image.secure_url;
  }
  const newProduct = await product_model_default.create({
    name,
    description,
    price,
    category,
    image: imageUrl,
    createdBy: userId
  });
  await category_model_default.findByIdAndUpdate(category, {
    $push: { products: newProduct._id }
  });
  return newProduct;
};
var getAllProducts = async () => {
  const products = await product_model_default.find().populate("category", "name description");
  return products;
};
var getProductDetails = async (productId) => {
  const product = await product_model_default.findById(productId).populate("category").populate("createdBy", "firstName lastName email");
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return product;
};
var getProductById = async (productId) => {
  const product = await product_model_default.findById(productId).populate("category", "name").exec();
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return product;
};
var updateProduct = async (productId, input) => {
  const { name, description, price, categoryId, imageFile } = input;
  let updatedData = { name, description, price };
  if (categoryId) updatedData.category = categoryId;
  if (imageFile) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const uploadedImage = await uploadImageToCloudinary(imageFile, folderName, 500, 500);
    updatedData.image = uploadedImage.secure_url;
  }
  const updatedProduct = await product_model_default.findByIdAndUpdate(productId, updatedData, {
    new: true
  });
  if (!updatedProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return updatedProduct;
};
var deleteProduct = async (productId) => {
  const deletedProduct = await product_model_default.findByIdAndDelete(productId);
  if (!deletedProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Product deleted successfully" };
};
var searchProducts = async (keyword) => {
  if (!keyword) {
    const error = new Error("Keyword is required");
    error.statusCode = 400;
    throw error;
  }
  const products = await product_model_default.find({
    name: { $regex: keyword, $options: "i" }
  }).populate("category", "name");
  return products;
};
var filterProducts = async (filters) => {
  const { categoryId, minPrice, maxPrice } = filters;
  let filter = {};
  if (categoryId) filter.category = categoryId;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  const products = await product_model_default.find(filter).populate("category", "name");
  return products;
};
var product_service_default = {
  createProduct,
  getAllProducts,
  getProductDetails,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProducts
};

// src/modules/products/product.controller.ts
var createProduct2 = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageFile = req.files?.image;
    const newProduct = await product_service_default.createProduct({
      name,
      description,
      price,
      category,
      userId: req.user?.id,
      imageFile
    });
    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while creating product",
      error: error.message
    });
  }
};
var getAllProducts2 = async (_req, res) => {
  try {
    const products = await product_service_default.getAllProducts();
    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getProductDetails2 = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await product_service_default.getProductDetails(productId);
    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};
var updateProduct2 = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const imageFile = req.files?.image;
    const updatedProduct = await product_service_default.updateProduct(req.params.id, {
      name,
      description,
      price,
      categoryId,
      imageFile
    });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};
var deleteProduct2 = async (req, res) => {
  try {
    const result = await product_service_default.deleteProduct(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};
var searchProducts2 = async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await product_service_default.searchProducts(keyword);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};
var filterProducts2 = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice } = req.query;
    const products = await product_service_default.filterProducts({
      categoryId,
      minPrice,
      maxPrice
    });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// src/modules/products/product.routes.ts
var router3 = import_express3.default.Router();
router3.post("/createProduct", auth, isAdmin, createProduct2);
router3.put("/updateProduct/:id", auth, isAdmin, updateProduct2);
router3.delete("/deleteProduct/:id", auth, isAdmin, deleteProduct2);
router3.get("/getAllProducts", getAllProducts2);
router3.get("/getProduct/:id", getProductDetails2);
router3.get("/search", searchProducts2);
router3.get("/filter", filterProducts2);
var product_routes_default = router3;

// src/modules/categories/category.routes.ts
var import_express4 = __toESM(require("express"));

// src/modules/categories/category.service.ts
var createCategory = async (input) => {
  const { name, description, imageFile } = input;
  if (!name) {
    const error = new Error("All fields are required");
    error.statusCode = 404;
    throw error;
  }
  let imageUrl = "";
  if (imageFile) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const image = await uploadImageToCloudinary(imageFile, folderName);
    imageUrl = image.secure_url;
  }
  const categoryDetails = await category_model_default.create({
    name,
    description,
    image: imageUrl
  });
  return categoryDetails;
};
var showAllCategories = async () => {
  const allCategories = await category_model_default.find(
    {},
    { name: true, description: true, image: true }
  );
  return allCategories;
};
var getCategoryPageDetails = async (categoryId) => {
  const selectedCategory = await category_model_default.findById(categoryId).populate("products").exec();
  if (!selectedCategory) {
    const error = new Error("Data Not Found");
    error.statusCode = 404;
    throw error;
  }
  return selectedCategory;
};
var category_service_default = {
  createCategory,
  showAllCategories,
  getCategoryPageDetails
};

// src/modules/categories/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageFile = req.files?.image;
    await category_service_default.createCategory({
      name,
      description,
      imageFile
    });
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully"
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};
var showAllCategories2 = async (_req, res) => {
  try {
    const allCategories = await category_service_default.showAllCategories();
    return res.status(200).json({
      success: true,
      message: "All tags returned successfully",
      data: allCategories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var categoryPageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const selectedCategory = await category_service_default.getCategoryPageDetails(id);
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// src/modules/categories/category.routes.ts
var router4 = import_express4.default.Router();
router4.post("/createCategory", auth, isAdmin, createCategory2);
router4.get("/showAllCategories", showAllCategories2);
router4.get("/categoryPageDetails/:id", categoryPageDetails);
var category_routes_default = router4;

// src/modules/orders/order.routes.ts
var import_express5 = __toESM(require("express"));

// src/modules/orders/order.service.ts
var placeOrder = async (input) => {
  const { userId, shippingAddress, totalAmount, paymentMethod, paymentStatus } = input;
  let { products } = input;
  const user = await user_model_default.findById(userId).populate("cart");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  if ((!products || products.length === 0) && user.cart && user.cart.length > 0) {
    products = user.cart.map((p) => ({
      product: p._id,
      quantity: 1
    }));
  }
  if (!products || products.length === 0) {
    const error = new Error("No products provided for order");
    error.statusCode = 400;
    throw error;
  }
  let calculatedTotal = 0;
  const formattedProducts = [];
  for (const item of products) {
    const productId = item.product || item._id;
    const qty = item.quantity || 1;
    const productDoc = await product_model_default.findById(productId);
    if (productDoc) {
      calculatedTotal += (productDoc.price || 0) * qty;
      formattedProducts.push({
        product: productDoc._id,
        quantity: qty
      });
      await product_model_default.findByIdAndUpdate(productDoc._id, {
        $inc: { stock: -qty }
      });
    }
  }
  const finalAmount = totalAmount ? Number(totalAmount) : calculatedTotal;
  const order = await order_model_default.create({
    user: userId,
    products: formattedProducts,
    totalAmount: finalAmount,
    shippingAddress: shippingAddress || {},
    status: "Processing",
    paymentStatus: paymentStatus || "Paid",
    paymentMethod: paymentMethod || "eSewa"
  });
  await user_model_default.findByIdAndUpdate(userId, { $set: { cart: [] } });
  const populatedOrder = await order_model_default.findById(order._id).populate({
    path: "products.product",
    populate: { path: "category" }
  });
  return populatedOrder;
};
var getUserOrders3 = async (userId) => {
  const orders = await order_model_default.find({ user: userId }).populate({
    path: "products.product",
    populate: { path: "category" }
  }).sort({ createdAt: -1 });
  return orders || [];
};
var getAllOrders = async () => {
  const orders = await order_model_default.find().populate("user", "firstName lastName email").populate({
    path: "products.product",
    populate: { path: "category" }
  }).sort({ createdAt: -1 });
  return orders || [];
};
var updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    const error = new Error("Invalid status value");
    error.statusCode = 400;
    throw error;
  }
  const updatedOrder = await order_model_default.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate({
    path: "products.product",
    populate: { path: "category" }
  });
  if (!updatedOrder) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }
  return updatedOrder;
};
var order_service_default = {
  placeOrder,
  getUserOrders: getUserOrders3,
  getAllOrders,
  updateOrderStatus
};

// src/modules/orders/order.controller.ts
var placeOrder2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { products, shippingAddress, totalAmount, paymentMethod, paymentStatus } = req.body;
    const populatedOrder = await order_service_default.placeOrder({
      userId,
      products,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus
    });
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder
    });
  } catch (error) {
    console.error("Place order error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while placing order",
      error: error.message
    });
  }
};
var getUserOrders4 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const orders = await order_service_default.getUserOrders(userId);
    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      orders: orders || [],
      data: orders || []
    });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while fetching user orders",
      error: error.message
    });
  }
};
var getAllOrders2 = async (_req, res) => {
  try {
    const orders = await order_service_default.getAllOrders();
    return res.status(200).json({
      success: true,
      orders: orders || [],
      data: orders || []
    });
  } catch (error) {
    console.error("getAllOrders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while fetching orders",
      error: error.message
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await order_service_default.updateOrderStatus(orderId, status);
    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while updating order status",
      error: error.message
    });
  }
};

// src/modules/orders/order.routes.ts
var router5 = import_express5.default.Router();
router5.post("/placeOrder", auth, placeOrder2);
router5.get("/getUserOrders", auth, getUserOrders4);
router5.get("/myOrders", auth, getUserOrders4);
router5.get("/getUserOrders/:id", auth, getUserOrders4);
router5.get("/getAllOrders", auth, isAdmin, getAllOrders2);
router5.post("/updateOrderStatus", auth, isAdmin, updateOrderStatus2);
router5.put("/updateOrderStatus", auth, isAdmin, updateOrderStatus2);
var order_routes_default = router5;

// src/modules/payments/payment.routes.ts
var import_express6 = __toESM(require("express"));

// src/modules/payments/payment.service.ts
var import_crypto2 = __toESM(require("crypto"));
var import_axios = __toESM(require("axios"));
var ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
var ESEWA_SECRET = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
var ESEWA_FORM_URL = process.env.ESEWA_FORM_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
function signBase64(message, secret) {
  return import_crypto2.default.createHmac("sha256", secret).update(message).digest("base64");
}
var initEsewa = async (input) => {
  const {
    amount,
    tax_amount = 0,
    product_delivery_charge = 0,
    product_service_charge = 0,
    transaction_uuid,
    success_url,
    failure_url
  } = input;
  if (!amount || !transaction_uuid || !success_url || !failure_url) {
    const error = new Error("Missing fields");
    error.statusCode = 400;
    throw error;
  }
  const total_amount = Number(amount) + Number(tax_amount) + Number(product_delivery_charge) + Number(product_service_charge);
  const signed_field_names = "total_amount,transaction_uuid,product_code";
  const payload = {
    amount: String(amount),
    tax_amount: String(tax_amount),
    total_amount: String(total_amount),
    transaction_uuid: String(transaction_uuid),
    product_code: ESEWA_PRODUCT_CODE,
    product_service_charge: String(product_service_charge),
    product_delivery_charge: String(product_delivery_charge),
    success_url,
    failure_url,
    signed_field_names
  };
  const message = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;
  const signature = signBase64(message, ESEWA_SECRET);
  return {
    formUrl: ESEWA_FORM_URL,
    fields: { ...payload, signature }
  };
};
var checkEsewaStatus = async (uuid, total) => {
  if (!uuid || !total) {
    const error = new Error("Missing params");
    error.statusCode = 400;
    throw error;
  }
  const url = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${encodeURIComponent(
    total
  )}&transaction_uuid=${encodeURIComponent(uuid)}`;
  const { data } = await import_axios.default.get(url);
  return data;
};
var payment_service_default = {
  initEsewa,
  checkEsewaStatus
};

// src/modules/payments/payment.controller.ts
var initEsewa2 = async (req, res) => {
  try {
    const result = await payment_service_default.initEsewa(req.body);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("initEsewa error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var statusEsewa = async (req, res) => {
  try {
    const { uuid, total } = req.query;
    const data = await payment_service_default.checkEsewaStatus(uuid, total);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("statusEsewa error:", error?.response?.data || error.message);
    const statusCode = error.statusCode || 502;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Status check failed"
    });
  }
};

// src/modules/payments/payment.routes.ts
var router6 = import_express6.default.Router();
router6.post("/init", initEsewa2);
router6.get("/status", statusEsewa);
var payment_routes_default = router6;

// src/config/database.ts
var import_mongoose7 = __toESM(require("mongoose"));
var import_dotenv3 = __toESM(require("dotenv"));
import_dotenv3.default.config();
var connect = () => {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error("MONGODB_URL environment variable is missing!");
    process.exit(1);
  }
  import_mongoose7.default.connect(mongoUrl).then(() => console.log("Connection successful with database")).catch((error) => {
    console.log("Issue in db connection");
    console.error(error);
    process.exit(1);
  });
};
var database_default = { connect };

// src/config/cloudiary.ts
var import_cloudinary2 = require("cloudinary");
var cloudinaryConnect = () => {
  try {
    import_cloudinary2.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
    console.log("Cloudinary connected");
  } catch (error) {
    console.log("Cloudinary connection failed", error);
  }
};

// src/index.ts
import_dotenv4.default.config();
var app = (0, import_express7.default)();
database_default.connect();
app.set("etag", false);
app.use(import_express7.default.json());
app.use((0, import_cookie_parser.default)());
app.use(
  (0, import_cors.default)({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const staticAllowed = [
        "http://localhost:5173",
        "https://e-pasal-two.vercel.app",
        process.env.FRONTEND_URL
      ].filter(Boolean);
      const isLocalNetwork = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(
        origin
      );
      const isVercel = origin.endsWith(".vercel.app") || origin.includes("vercel.app");
      if (staticAllowed.includes(origin) || isLocalNetwork || isVercel) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(
  (0, import_express_fileupload.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);
cloudinaryConnect();
app.use("/api/v1", (_req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store"
  });
  next();
});
app.use("/api/v1/auth", auth_routes_default);
app.use("/api/v1/profile", profile_routes_default);
app.use("/api/v1/products", product_routes_default);
app.use("/api/v1/categories", category_routes_default);
app.use("/api/v1/orders", order_routes_default);
app.use("/api/v1/payment", payment_routes_default);
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Your E-Pasal Server is up and running (TypeScript)"
  });
});
var PORT = process.env.PORT || 4e3;
app.listen(PORT, () => {
  console.log(`E-Pasal app is listening at PORT ${PORT}`);
});
var index_default = app;

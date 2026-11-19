import express, { Router } from "express";
import {
  login,
  signUp,
  sendOtp,
  changePassword,
  logout,
  refreshToken,
} from "../controller/auth";
import { resetPasswordToken, resetPassword } from "../controller/resetPassword";
import { auth } from "../middleware/auth";

const router: Router = express.Router();

// Authentication routes
router.post("/login", login as any);
router.post("/refresh-token", refreshToken as any);
router.post("/logout", logout as any);
router.get("/logout", logout as any);
router.post("/signup", signUp as any);
router.post("/sendotp", sendOtp as any);
router.post("/changepassword", auth as any, changePassword as any);

// Reset Password
router.post("/reset-password-token", resetPasswordToken as any);
router.post("/reset-password", resetPassword as any);

export default router;

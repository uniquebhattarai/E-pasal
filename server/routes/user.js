const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  sendOtp,
  changePassword,
} = require("../controller/auth");
const { resetPasswordToken, resetPassword } = require("../controller/resetPassword");
const { auth } = require("../middleware/auth");

// Authentication routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOtp);
router.post("/changepassword", auth, changePassword);

// Reset Password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;

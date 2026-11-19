import { Response } from "express";
import authService from "./auth.service";
import { AuthenticatedRequest } from "../../types";

export const resetPasswordToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const result = await authService.resetPasswordToken(email);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("resetPasswordToken error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while generating reset token",
    });
  }
};

export const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { password, confirmPassword, token } = req.body;
    const result = await authService.resetPassword({
      password,
      confirmPassword,
      token,
    });

    if (!result.success) {
      return res.status(200).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while resetting password",
    });
  }
};

export default {
  resetPasswordToken,
  resetPassword,
};

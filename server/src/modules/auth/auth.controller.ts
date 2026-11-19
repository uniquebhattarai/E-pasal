import { Response } from "express";
import authService from "./auth.service";
import { AuthenticatedRequest } from "../../types";

export const sendOtp = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const result = await authService.sendOtp(email);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("sendOtp error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const signUp = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const user = await authService.signUp(req.body);
    return res.status(200).json({
      success: true,
      message: "Signup successful",
      user,
    });
  } catch (error: any) {
    console.error("signUp error:", error);
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while doing signup",
    });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    if (!result.isPasswordMatch) {
      return res.status(200).json({
        success: false,
        message: "Password is incorrect",
      });
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

    res.cookie("token", result.token, accessTokenOptions);
    res.cookie("refreshToken", result.refreshToken, refreshTokenOptions);

    return res.status(200).json({
      success: true,
      user: result.user,
      token: result.token,
      message: "Logged in successfully",
    });
  } catch (error: any) {
    console.error("login error:", error);
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while login, please try again later",
    });
  }
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    const tokens = await authService.refreshToken(incomingRefreshToken);

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

    res.cookie("token", tokens.newAccessToken, accessTokenOptions);
    res.cookie("refreshToken", tokens.newRefreshToken, refreshTokenOptions);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: tokens.newAccessToken,
    });
  } catch (error: any) {
    console.error("refreshToken error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while refreshing token",
    });
  }
};

export const logout = async (_req: AuthenticatedRequest, res: Response): Promise<any> => {
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
    console.error("logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
      error: error.message,
    });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    const result = await authService.changePassword({
      userId: userId!,
      oldPassword,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("changePassword error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while updating password",
    });
  }
};

export default {
  sendOtp,
  signUp,
  login,
  refreshToken,
  logout,
  changePassword,
};

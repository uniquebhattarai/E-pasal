import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";
import { AuthenticatedRequest, AuthJwtPayload } from "../types";

dotenv.config();

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
        message: "Token is missing",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(token, secret) as AuthJwtPayload;
    req.user = decoded;

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
      error: error.message,
    });
  }
};

export const isCustomer = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: email missing",
      });
    }

    const userDetails = await User.findOne({ email: req.user.email });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.accountType !== "Customer") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Customers",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User Role Can't be Verified" });
  }
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: email missing",
      });
    }

    const userDetails = await User.findOne({ email: req.user.email });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User Role Can't be Verified" });
  }
};

export const isInstructor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: email missing",
      });
    }

    const userDetails = await User.findOne({ email: req.user.email });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User Role Can't be Verified" });
  }
};

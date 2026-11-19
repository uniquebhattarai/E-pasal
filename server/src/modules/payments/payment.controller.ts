import { Response } from "express";
import paymentService from "./payment.service";
import { AuthenticatedRequest } from "../../types";

export const initEsewa = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const result = await paymentService.initEsewa(req.body);
    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("initEsewa error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const statusEsewa = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { uuid, total } = req.query;
    const data = await paymentService.checkEsewaStatus(uuid as string, total as string);

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("statusEsewa error:", error?.response?.data || error.message);
    const statusCode = error.statusCode || 502;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Status check failed",
    });
  }
};

export default {
  initEsewa,
  statusEsewa,
};

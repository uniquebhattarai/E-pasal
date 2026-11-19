import { Response } from "express";
import orderService from "./order.service";
import { AuthenticatedRequest } from "../../types";

export const placeOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { products, shippingAddress, totalAmount, paymentMethod, paymentStatus } = req.body;

    const populatedOrder = await orderService.placeOrder({
      userId,
      products,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error: any) {
    console.error("Place order error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while placing order",
      error: error.message,
    });
  }
};

export const getUserOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await orderService.getUserOrders(userId);

    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      orders: orders || [],
      data: orders || [],
    });
  } catch (error: any) {
    console.error("Fetch user orders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while fetching user orders",
      error: error.message,
    });
  }
};

export const getAllOrders = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const orders = await orderService.getAllOrders();

    return res.status(200).json({
      success: true,
      orders: orders || [],
      data: orders || [],
    });
  } catch (error: any) {
    console.error("getAllOrders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while fetching orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("updateOrderStatus error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while updating order status",
      error: error.message,
    });
  }
};

export default {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};

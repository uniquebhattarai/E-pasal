import express, { Router } from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "./order.controller";
import { auth, isAdmin } from "../../middleware/auth";

const router: Router = express.Router();

// Authenticated user routes
router.post("/placeOrder", auth as any, placeOrder as any);
router.get("/getUserOrders", auth as any, getUserOrders as any);
router.get("/myOrders", auth as any, getUserOrders as any);
router.get("/getUserOrders/:id", auth as any, getUserOrders as any);

// Admin routes
router.get("/getAllOrders", auth as any, isAdmin as any, getAllOrders as any);
router.post("/updateOrderStatus", auth as any, isAdmin as any, updateOrderStatus as any);
router.put("/updateOrderStatus", auth as any, isAdmin as any, updateOrderStatus as any);

export default router;

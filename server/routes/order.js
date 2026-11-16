const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/order");

const { auth, isAdmin } = require("../middleware/auth");

// Authenticated user routes
router.post("/placeOrder", auth, placeOrder);
router.get("/getUserOrders", auth, getUserOrders);
router.get("/myOrders", auth, getUserOrders);
router.get("/getUserOrders/:id", auth, getUserOrders);

// Admin routes
router.get("/getAllOrders", auth, isAdmin, getAllOrders);
router.post("/updateOrderStatus", auth, isAdmin, updateOrderStatus);
router.put("/updateOrderStatus", auth, isAdmin, updateOrderStatus);

module.exports = router;

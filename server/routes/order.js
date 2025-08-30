const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controller/order");

const { auth, isCustomer, isAdmin } = require("../middleware/auth");

// Customer routes
router.post("/placeOrder", auth, isCustomer, placeOrder);

// Admin routes
router.get("/getAllOrders", auth, isAdmin, getAllOrders);

router.get("/updateOrderStatus", auth, isAdmin, updateOrderStatus);

// Customer routes
router.get("/getUserOrders/:id", auth, isCustomer, getUserOrders);

module.exports = router;

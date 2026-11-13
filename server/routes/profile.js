const express = require("express");
const router = express.Router();

const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  updateDisplayPicture,
  getUserOrders,
  toggleWishlist,
  getWishlist,
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
} = require("../controller/profile");

const { auth, isCustomer, isAdmin } = require("../middleware/auth");


router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getUserDetails);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.post("/toggleWishlist", auth, toggleWishlist);
router.get("/getWishlist", auth, getWishlist);
router.get("/getCart", auth, getCart);
router.post("/addToCart", auth, addToCart);
router.post("/removeFromCart", auth, removeFromCart);
router.post("/clearCart", auth, clearCart);
router.get("/getUserOrders", auth, getUserOrders);
router.get("/myOrders", auth, getUserOrders);



module.exports = router;

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
} = require("../controller/profile");

const { auth, isCustomer, isAdmin } = require("../middleware/auth");


router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getUserDetails);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.post("/toggleWishlist", auth, toggleWishlist);
router.get("/getWishlist", auth, getWishlist);



module.exports = router;

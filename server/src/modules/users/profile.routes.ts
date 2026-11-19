import express, { Router } from "express";
import {
  deleteAccount,
  updateProfile,
  updateProfileHeader,
  updateAbout,
  updatePersonalDetails,
  getUserDetails,
  updateDisplayPicture,
  getUserOrders,
  toggleWishlist,
  getWishlist,
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
} from "./profile.controller";
import { auth } from "../../middleware/auth";

const router: Router = express.Router();

router.delete("/deleteProfile", auth as any, deleteAccount as any);
router.put("/updateProfile", auth as any, updateProfile as any);
router.put("/updateProfileHeader", auth as any, updateProfileHeader as any);
router.put("/updateAbout", auth as any, updateAbout as any);
router.put("/updatePersonalDetails", auth as any, updatePersonalDetails as any);
router.get("/getUserDetails", auth as any, getUserDetails as any);
router.put("/updateDisplayPicture", auth as any, updateDisplayPicture as any);
router.post("/toggleWishlist", auth as any, toggleWishlist as any);
router.get("/getWishlist", auth as any, getWishlist as any);
router.get("/getCart", auth as any, getCart as any);
router.post("/addToCart", auth as any, addToCart as any);
router.post("/removeFromCart", auth as any, removeFromCart as any);
router.post("/clearCart", auth as any, clearCart as any);
router.get("/getUserOrders", auth as any, getUserOrders as any);
router.get("/myOrders", auth as any, getUserOrders as any);

export default router;

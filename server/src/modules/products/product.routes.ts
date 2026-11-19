import express, { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  searchProducts,
  filterProducts,
} from "./product.controller";
import { auth, isAdmin } from "../../middleware/auth";

const router: Router = express.Router();

// Admin-only routes
router.post("/createProduct", auth as any, isAdmin as any, createProduct as any);
router.put("/updateProduct/:id", auth as any, isAdmin as any, updateProduct as any);
router.delete("/deleteProduct/:id", auth as any, isAdmin as any, deleteProduct as any);

// Public routes
router.get("/getAllProducts", getAllProducts as any);
router.get("/getProduct/:id", getProductDetails as any);

// Search and filter products
router.get("/search", searchProducts as any);
router.get("/filter", filterProducts as any);

export default router;

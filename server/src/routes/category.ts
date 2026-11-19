import express, { Router } from "express";
import {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} from "../controller/category";
import { auth, isAdmin } from "../middleware/auth";

const router: Router = express.Router();

// Admin-only routes
router.post("/createCategory", auth as any, isAdmin as any, createCategory as any);

// Public routes
router.get("/showAllCategories", showAllCategories as any);
router.get("/categoryPageDetails/:id", categoryPageDetails as any);

export default router;

const express = require("express");
const router = express.Router();

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controller/category");

const { auth, isAdmin } = require("../middleware/auth");

// Admin-only routes
router.post("/createCategory", auth, isAdmin, createCategory);

// Public routes
router.get("/showAllCategories", showAllCategories);
router.get("/categoryPageDetails/:id", categoryPageDetails);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  searchProducts,
  filterProducts
  // optional
} = require("../controller/product");

const { auth, isAdmin } = require("../middleware/auth");

// Admin-only routes
router.post("/createProduct", auth, isAdmin, createProduct);
router.put("/updateProduct/:id", auth, isAdmin, updateProduct);
router.delete("/deleteProduct/:id", auth, isAdmin, deleteProduct);

// Public routes
router.get("/getAllProducts", getAllProducts);
router.get("/getProduct/:id", getProductDetails);

// Optional: Search and filter products
router.get("/search", searchProducts);
router.get("/filter", filterProducts);

module.exports = router;
